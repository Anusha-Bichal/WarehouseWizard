import {
	Button,
	Checkbox,
	NumberInput,
	Select,
	TextInput,
	Textarea,
} from "@mantine/core"
import {Condition, ProductStatus} from "@prisma/client"
import type {ActionArgs} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {useFetcher, useLoaderData} from "@remix-run/react"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"
import {sendMail} from "~/lib/mail.server"
import {getAllCustomers} from "~/lib/user.server"

export async function loader() {
	const customers = await getAllCustomers()

	return json({
		customers,
	})
}

type ActionData = {
	success: boolean
	fieldErrors?: Record<string, string>
}

export async function action({request}: ActionArgs) {
	const formData = await request.formData()

	const name = formData.get("name")?.toString()
	const quantity = formData.get("quantity")?.toString()
	const memo = formData.get("memo")?.toString()
	const condition = formData.get("condition")?.toString()
	const isReturn = formData.get("return")?.toString()
	const upc = formData.get("upc")?.toString()
	const customerId = formData.get("customerId")?.toString()

	const warehouse = await prisma.warehouse.findFirst({})

	if (!warehouse) {
		return redirect("/employee")
	}

	if (!customerId) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				customerId: "Select a customer",
			},
		})
	}

	const customer = await prisma.user.findUnique({
		where: {
			Id: customerId,
		},
	})

	if (!customer) {
		return redirect("/employee")
	}

	if (!upc) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				upc: "UPC is required",
			},
		})
	}

	if (!name) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				name: "Name is required",
			},
		})
	}

	if (!condition) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				condition: "Condition is required",
			},
		})
	}

	if (!quantity) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				quantity: "Quantity is required",
			},
		})
	}

	const _return = isReturn === "on"

	// if (_return) {
	// 	await prisma.product.update({
	// 		where: {
	// 			Id: productId,
	// 		},
	// 		data: {
	// 			Status: ProductStatus.RETURNED,
	// 			Memo: memo,
	// 			Condition: condition as Condition,
	// 			Return: _return,
	// 		},
	// 	})

	// 	return redirect("/employee")
	// }

	await prisma.product.create({
		data: {
			CheckedInTime: new Date(),
			Status: ProductStatus.CHECKED_IN,
			Memo: memo,
			Condition: condition as Condition,
			Return: false,
			Name: name,
			Quantity: Number(quantity),
			UPC: upc,
			WarehouseId: warehouse.Id,
			UserId: customerId,
		},
	})

	await sendMail(
		customer.Email,
		"Check In",
		`Hi ${customer.Name}, Your product ${name} has been checked in. Please check your account for more details.`
	)

	return redirect("/employee")
}

export default function OwnerInventory() {
	const {customers} = useLoaderData<typeof loader>()

	const fetcher = useFetcher<ActionData>()
	const isSubmitting = fetcher.state !== "idle"

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<fetcher.Form method="post" className="flex flex-col gap-12">
					<PageHeading title="CHECK IN" />

					<div className="flex flex-col gap-4">
						<TextInput
							name="name"
							label="Product Name"
							placeholder="Enter product name"
							error={fetcher.data?.fieldErrors?.name}
							required
						/>

						<TextInput
							name="upc"
							label="UPC"
							placeholder="Enter UPC"
							error={fetcher.data?.fieldErrors?.upc}
							required
						/>

						<NumberInput
							name="quantity"
							label="Quantity"
							placeholder="Enter quantity"
							error={fetcher.data?.fieldErrors?.quantity}
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

						<Select
							name="condition"
							label="Condition"
							data={Object.values(Condition).map((condition) => ({
								value: condition,
								label: condition,
							}))}
							error={fetcher.data?.fieldErrors?.condition}
							defaultValue={Condition.NEW}
						/>

						<Textarea
							name="memo"
							label="Memo"
							placeholder="Enter memo"
							minRows={6}
						/>

						<Checkbox name="return" label="Return" />
					</div>

					<div className="flex items-center justify-end">
						<Button type="submit" loading={isSubmitting}>
							Check In
						</Button>
					</div>
				</fetcher.Form>
			</div>
		</>
	)
}
