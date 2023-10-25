import {Button, Divider, Modal, NumberInput, TextInput} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {CheckOutStatus} from "@prisma/client"
import type {ActionArgs, DataFunctionArgs} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {useFetcher, useLoaderData} from "@remix-run/react"
import {ArrowRightIcon} from "lucide-react"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"
import {sendMail} from "~/lib/mail.server"
import {requireUserId} from "~/session.server"
import {UserRole} from "~/utils/constants"
import {formatDateTime} from "~/utils/misc"

export async function loader({request, params}: DataFunctionArgs) {
	const productId = params.productId
	const userId = await requireUserId(request)

	const user = await prisma.user.findUnique({
		where: {
			Id: userId,
		},
	})

	if (!user) {
		return redirect("/")
	}

	if (!productId) {
		return redirect("/")
	}

	try {
		const product = await prisma.product.findUnique({
			where: {
				Id: productId,
			},
			include: {
				Warehouse: true,
				CheckOutRequests: true,
				_count: {
					select: {
						CheckOutRequests: true,
					},
				},
			},
		})

		if (!product) {
			return redirect("/", 404)
		}

		return json({
			product,
			user,
		})
	} catch (error) {
		return redirect("/")
	}
}

type ActionData = {
	success: boolean
	fieldErrors?: {
		customerName?: string
		productId?: string
		quantity?: string
		customerPhone?: string
		customerAddress1?: string
		customerAddress2?: string
		customerCity?: string
		customerState?: string
		customerZip?: string
	}
}

export async function action({request}: ActionArgs) {
	const formData = await request.formData()

	const userId = await requireUserId(request)
	const productId = formData.get("productId")?.toString()
	const customerName = formData.get("customerName")?.toString()
	const quantity = formData.get("quantity")?.toString()
	const customerPhone = formData.get("customerPhone")?.toString()
	const customerAddress1 = formData.get("customerAddress1")?.toString()
	const customerAddress2 = formData.get("customerAddress2")?.toString()
	const customerCity = formData.get("customerCity")?.toString()
	const customerState = formData.get("customerState")?.toString()
	const customerZip = formData.get("customerZip")?.toString()

	const fieldErrors: ActionData["fieldErrors"] = {}

	if (!productId) {
		fieldErrors.productId = "Product Id is required"
	}

	if (!customerName) {
		fieldErrors.customerName = "Customer name is required"
	}

	if (!customerPhone) {
		fieldErrors.customerPhone = "Customer phone is required"
	}

	if (!customerAddress1) {
		fieldErrors.customerAddress1 = "Customer address is required"
	}

	if (!customerCity) {
		fieldErrors.customerCity = "Customer city is required"
	}

	if (!customerState) {
		fieldErrors.customerState = "Customer state is required"
	}

	if (!customerZip) {
		fieldErrors.customerZip = "Customer zip code is required"
	}

	// Get all the fields into a fields object so that they are not undefined (expect the optional ones)
	if (Object.keys(fieldErrors).length > 0) {
		return json<ActionData>({
			success: false,
			fieldErrors,
		})
	}

	const fields = {
		ProductId: productId!,
		CustomerName: customerName!,
		CustomerPhone: customerPhone!,
		CustomerAddress1: customerAddress1!,
		CustomerAddress2: customerAddress2,
		CustomerCity: customerCity!,
		CustomerState: customerState!,
		CustomerZip: customerZip!,
		Quantity: Number(quantity!),
	}

	await prisma.$transaction(async (tx) => {
		await tx.checkOutRequest.create({
			data: {
				userId,
				Status: CheckOutStatus.PENDING,
				...fields,
			},
		})

		const product = await tx.product.update({
			where: {
				Id: fields.ProductId,
			},
			data: {
				Quantity: {
					decrement: fields.Quantity,
				},
			},
		})

		const employee = await prisma.user.findFirst({
			where: {
				Role: UserRole.EMPLOYEE,
			},
		})

		if (!employee) {
			return json({
				success: false,
				fieldErrors: {
					productId: "No employee found",
				},
			})
		}

		await sendMail(
			employee.Email,
			"New Check Out Request",
			`A new check out request has been made by ${customerName} for ${quantity} units of product ${product.UPC}`
		)
	})

	return redirect("/")
}

export default function CustomerCheckout() {
	const {product, user} = useLoaderData<typeof loader>()

	const fetcher = useFetcher<ActionData>()
	const isSubmitting = fetcher.state !== "idle"

	const [isModalOpen, handleModal] = useDisclosure(false)

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<fetcher.Form method="post" className="flex flex-col gap-12">
					<PageHeading title="CUSTOMER CHECKOUT" />

					<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table className="w-full">
							<thead>
								<tr>
									<th className="px-4 py-2">Warehouse</th>
									<th className="px-4 py-2">UPC</th>
									<th className="px-4 py-2">Product</th>
									<th className="px-4 py-2">Quantity</th>
									<th className="px-4 py-2">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border px-4 py-2">{product.Warehouse.Name}</td>
									<td className="border px-4 py-2">{product.UPC}</td>
									<td className="border px-4 py-2">{product.Name}</td>
									<td className="border px-4 py-2">
										<NumberInput
											defaultValue={1}
											name="quantity"
											description={`Max quantity ${product.Quantity}`}
											min={1}
											max={product.Quantity}
											error={fetcher.data?.fieldErrors?.quantity}
										/>
									</td>
									<td
										className="border px-4 py-2 text-center"
										onClick={handleModal.open}
									>
										<Button
											variant="white"
											color="blue"
											size="compact-sm"
											onClick={handleModal.open}
										>
											Check
										</Button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="flex flex-col gap-8">
						<input type="hidden" name="productId" defaultValue={product.Id} />

						<h2 className="text-xl font-semibold">Shipping Information</h2>

						<fieldset
							className="grid grid-cols-2 gap-4"
							disabled={isSubmitting}
						>
							<div className="flex flex-col gap-4">
								<TextInput
									name="customerName"
									label="Customer Name"
									placeholder="Enter customer name"
									defaultValue={user.Name}
									required
									className="w-full"
									autoComplete="off"
									error={fetcher.data?.fieldErrors?.customerName}
								/>
								<NumberInput
									name="customerPhone"
									label="Customer Phone"
									placeholder="Enter customer phone"
									className="w-full"
									required
									min={0}
									autoComplete="off"
									pattern="[0-9]{10}"
									title="Please enter a valid 10 digit phone number"
									error={fetcher.data?.fieldErrors?.customerPhone}
								/>
							</div>

							<div className="flex flex-col gap-4">
								<TextInput
									name="customerAddress1"
									label="Street Address 1"
									placeholder="Enter street address"
									required
									autoComplete="off"
									error={fetcher.data?.fieldErrors?.customerAddress1}
								/>
								<TextInput
									name="customerAddress2"
									label="Street Address 2"
									placeholder="Enter apartment details (optional)"
									autoComplete="off"
									error={fetcher.data?.fieldErrors?.customerAddress2}
								/>
								<TextInput
									name="customerCity"
									label="City"
									placeholder="Enter city"
									required
									autoComplete="off"
									error={fetcher.data?.fieldErrors?.customerCity}
								/>
								<TextInput
									name="customerState"
									label="State"
									placeholder="Enter state"
									required
									autoComplete="off"
									error={fetcher.data?.fieldErrors?.customerState}
								/>
								<TextInput
									name="customerZip"
									label="Zip Code"
									placeholder="Enter zip code"
									required
									autoComplete="off"
									pattern="[0-9]*"
									error={fetcher.data?.fieldErrors?.customerZip}
								/>
							</div>
						</fieldset>

						<Divider />

						<div className="flex items-center justify-end">
							<Button
								type="submit"
								loading={isSubmitting}
								rightSection={<ArrowRightIcon size={18} />}
							>
								Check Out
							</Button>
						</div>
					</div>
				</fetcher.Form>
			</div>

			<Modal
				title="Product Status"
				opened={isModalOpen}
				onClose={handleModal.close}
			>
				<Divider />

				<div className="mt-8">
					{product.CheckedInTime && (
						<p>Checked In At: {formatDateTime(product.CheckedInTime)}</p>
					)}

					<ul className="mt-4">
						{product.CheckOutRequests.map((request) => {
							const isApproved = request.Status === CheckOutStatus.CHECKED_OUT

							return (
								<li key={request.Id}>
									<p>
										<b>Quantity</b>: {request.Quantity}
									</p>
									<span>
										{isApproved ? "Checked Out At" : "Request sent at"}:{" "}
										{formatDateTime(request.CreatedAt)}
									</span>
								</li>
							)
						})}
					</ul>
				</div>
			</Modal>
		</>
	)
}
