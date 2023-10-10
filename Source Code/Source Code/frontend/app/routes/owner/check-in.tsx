import {Button, Divider, NumberInput, Select, TextInput} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {ProductStatus} from "@prisma/client"
import type {ActionArgs} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {Link, useFetcher, useLoaderData} from "@remix-run/react"
import {ArrowRightIcon, SearchIcon} from "lucide-react"
import {EmptyState} from "~/components/EmptyState"
import {CustomDrawer} from "~/components/ui/CustomDrawer"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"
import {UserRole} from "~/utils/constants"

export async function loader() {
	const customers = await prisma.user.findMany({
		where: {
			Role: UserRole.CUSTOMER,
		},
	})
	const products = await prisma.product.findMany({
		where: {
			Status: ProductStatus.NOT_CHECKED_IN,
		},
		include: {
			User: {
				select: {
					Name: true,
				},
			},
		},
	})

	return json({
		products,
		customers,
	})
}

type ActionData = {
	success: boolean
	fieldErrors?: Record<string, string>
}

export async function action({request}: ActionArgs) {
	const formData = await request.formData()

	const warehouse = await prisma.warehouse.findFirst({})

	if (!warehouse) {
		return redirect("/owner")
	}

	const customerId = formData.get("customerId")?.toString()
	const name = formData.get("name")?.toString()
	const upc = formData.get("upc")?.toString()
	const quantity = formData.get("quantity")?.toString()

	if (!customerId) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				productId: "Customer is required",
			},
		})
	}

	if (!name) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				productId: "Product name is required",
			},
		})
	}

	if (!upc) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				productId: "UPC is required",
			},
		})
	}

	if (!quantity) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				productId: "Quantity is required",
			},
		})
	}

	await prisma.product.create({
		data: {
			UserId: customerId,
			WarehouseId: warehouse.Id,
			Name: name,
			UPC: upc,
			Quantity: Number(quantity),
			Status: ProductStatus.NOT_CHECKED_IN,
		},
	})

	return redirect("/owner/check-in")
}

export default function OwnerInventory() {
	const {products, customers} = useLoaderData<typeof loader>()

	const fetcher = useFetcher()
	const isSubmitting = fetcher.state !== "idle"

	const [isModalOpen, handleModal] = useDisclosure(false)

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="CHECK IN" />

					<div className="flex items-center justify-between">
						<TextInput
							label="Tracking Number"
							placeholder="Search tracking number"
							rightSection={<SearchIcon size={18} className="text-gray-500" />}
						/>

						<Button onClick={() => handleModal.open()}>Add Product</Button>
					</div>

					{products.length > 0 ? (
						<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
							<table className="w-full">
								<thead>
									<tr>
										<th className="px-4 py-2">UPC</th>
										<th className="px-4 py-2">Product Name</th>
										<th className="px-4 py-2">Customer Name</th>
										<th className="px-4 py-2">Product Quantity</th>
										<th className="px-4 py-2"></th>
									</tr>
								</thead>
								<tbody>
									{products.map((product) => (
										<tr key={product.Id}>
											<td className="border px-4 py-2">{product.UPC}</td>
											<td className="border px-4 py-2">{product.Name}</td>
											<td className="border px-4 py-2">{product.User.Name}</td>
											<td className="border px-4 py-2">{product.Quantity}</td>
											<td className="border px-4 py-2 text-right">
												<Button
													component={Link}
													to={product.Id}
													variant="subtle"
													rightIcon={<ArrowRightIcon size={18} />}
												>
													Check In
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<EmptyState message="No products to be checked in" />
					)}
				</div>
			</div>

			<CustomDrawer
				title="Add Product"
				opened={isModalOpen}
				onClose={() => handleModal.close()}
			>
				<fetcher.Form method="post" className="flex flex-col gap-4">
					<TextInput
						name="name"
						label="Product Name"
						placeholder="Enter product name"
						required
					/>

					<TextInput name="upc" label="UPC" placeholder="Enter UPC" required />

					<NumberInput
						name="quantity"
						label="Quantity"
						placeholder="Enter quantity"
						min={0}
						required
					/>

					<Select
						label="Customer"
						name="customerId"
						placeholder="Select customer"
						data={customers.map((customer) => ({
							value: customer.Id,
							label: customer.Name,
						}))}
						required
					/>

					<Divider />

					<Button type="submit" loading={isSubmitting}>
						Add
					</Button>
				</fetcher.Form>
			</CustomDrawer>
		</>
	)
}
