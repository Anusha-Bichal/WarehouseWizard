import {Button, Checkbox, Select, Textarea} from "@mantine/core"
import {Condition, ProductStatus} from "@prisma/client"
import type {ActionArgs, DataFunctionArgs} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {Link, useFetcher, useLoaderData} from "@remix-run/react"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"

export async function loader({params}: DataFunctionArgs) {
	const {productId} = params

	if (!productId) {
		return redirect("/owner/check-in")
	}

	const product = await prisma.product.findUnique({
		where: {
			Id: productId,
		},
		include: {
			User: {
				select: {
					Name: true,
				},
			},
		},
	})

	if (!product) {
		return redirect("/owner/check-in")
	}

	return json({
		product,
	})
}

type ActionData = {
	success: boolean
	fieldErrors?: Record<string, string>
}

export async function action({request}: ActionArgs) {
	const formData = await request.formData()

	const productId = formData.get("productId")?.toString()
	const memo = formData.get("memo")?.toString()
	const condition = formData.get("condition")?.toString()
	const isReturn = formData.get("return")?.toString()

	console.log({productId, memo, condition, isReturn})

	if (!productId) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				productId: "Product ID is required",
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

	// 	return redirect("/owner")
	// }

	await prisma.product.update({
		where: {
			Id: productId,
		},
		data: {
			CheckedInTime: new Date(),
			Status: ProductStatus.CHECKED_IN,
			Memo: memo,
			Condition: condition as Condition,
			Return: false,
		},
	})

	return redirect("/owner")
}

export default function OwnerInventory() {
	const {product} = useLoaderData<typeof loader>()

	const fetcher = useFetcher<ActionData>()

	const isSubmitting = fetcher.state !== "idle"

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<fetcher.Form method="POST" className="flex flex-col gap-12">
					<PageHeading title="PRODUCT CHECK IN" />

					<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table className="w-full">
							<thead>
								<tr>
									<th className="px-4 py-2">UPC</th>
									<th className="px-4 py-2">Product Name</th>
									<th className="px-4 py-2">Customer Name</th>
									<th className="px-4 py-2">Condition</th>
									<th className="px-4 py-2">Return</th>
									<th className="px-4 py-2">Product Quantity</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border px-4 py-2">{product.UPC}</td>
									<td className="border px-4 py-2">{product.Name}</td>
									<td className="border px-4 py-2">{product.User.Name}</td>
									<td className="border px-4 py-2">
										<Select
											name="condition"
											data={Object.values(Condition).map((condition) => ({
												value: condition,
												label: condition,
											}))}
											defaultValue={product.Condition ?? Condition.NEW}
										/>
									</td>
									<td className="border px-4 py-2 text-center">
										<Checkbox name="return" defaultChecked={product.Return} />
									</td>
									<td className="border px-4 py-2">{product.Quantity}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="flex flex-col gap-8">
						<input hidden name="productId" defaultValue={product.Id} />
						<Textarea
							name="memo"
							label="Memo"
							placeholder="Enter memo"
							minRows={6}
						/>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								disabled={isSubmitting}
								variant="outline"
								component={Link}
								to="/owner/check-in"
							>
								Cancel
							</Button>

							<Button type="submit" loading={isSubmitting}>
								Check In
							</Button>
						</div>
					</div>
				</fetcher.Form>
			</div>
		</>
	)
}
