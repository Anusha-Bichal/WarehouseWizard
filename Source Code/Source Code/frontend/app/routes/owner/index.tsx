/*import {PageHeading} from "~/components/ui/PageHeading"

export default function OwnerInventory() {
	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="OWNER INVENTORY" />

					<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table className="w-full">
							<thead>
								<tr>
									<th className="px-4 py-2">UPC</th>
									<th className="px-4 py-2">Product Name</th>
									<th className="px-4 py-2">Product Quantity</th>
									<th className="px-4 py-2">Customer Name</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border px-4 py-2">1234567890</td>
									<td className="border px-4 py-2">Apple iPhone 13</td>
									<td className="border px-4 py-2">50</td>
									<td className="border px-4 py-2">John Doe</td>
								</tr>
								<tr>
									<td className="border px-4 py-2">2345678901</td>
									<td className="border px-4 py-2">Samsung Galaxy S21</td>
									<td className="border px-4 py-2">75</td>
									<td className="border px-4 py-2">Jane Doe</td>
								</tr>
								<tr>
									<td className="border px-4 py-2">3456789012</td>
									<td className="border px-4 py-2">Google Pixel 6</td>
									<td className="border px-4 py-2">80</td>
									<td className="border px-4 py-2">Jim Doe</td>
								</tr>
								<tr>
									<td className="border px-4 py-2">4567890123</td>
									<td className="border px-4 py-2">OnePlus 9 Pro</td>
									<td className="border px-4 py-2">60</td>
									<td className="border px-4 py-2">Jill Doe</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}*/
import {PageHeading} from "~/components/ui/PageHeading"

import {ProductStatus} from "@prisma/client"
import {json} from "@remix-run/node"
import {useLoaderData} from "@remix-run/react"
import {EmptyState} from "~/components/EmptyState"
import {prisma} from "~/lib/db.server"
import {Badge} from "@mantine/core"

export async function loader() {
	const checkedInProducts = await prisma.product.findMany({
		where: {
			Status: ProductStatus.CHECKED_IN,
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
		checkedInProducts,
	})
}

export default function OwnerInventory() {
	const {checkedInProducts} = useLoaderData<typeof loader>()

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="OWNER INVENTORY" />

					{checkedInProducts.length > 0 ? (
						<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
							<table className="w-full">
								<thead>
									<tr>
										<th className="px-4 py-2">UPC</th>
										<th className="px-4 py-2">Product</th>
										<th className="px-4 py-2">Quantity</th>
										<th className="px-4 py-2">Condition</th>
										<th className="px-4 py-2">Customer Name</th>
									</tr>
								</thead>

								<tbody>
									{checkedInProducts.map((product) => (
										<tr key={product.Id}>
											<td className="border px-4 py-2">{product.UPC}</td>
											<td className="border px-4 py-2">{product.Name}</td>
											<td className="border px-4 py-2">{product.Quantity}</td>
											<td className="border px-4 py-2 text-center">
												<Badge
													radius="xs"
													color={
														product.Condition === "NEW"
															? "blue"
															: product.Condition === "USED"
															? "yellow"
															: "red"
													}
												>
													{product.Condition}
												</Badge>
											</td>
											<td className="border px-4 py-2">{product.User.Name}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<EmptyState message="No products checked in" />
					)}
				</div>
			</div>
		</>
	)
}

