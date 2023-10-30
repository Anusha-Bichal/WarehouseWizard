import {PageHeading} from "~/components/ui/PageHeading"

export default function OwnerInventory() {
	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="EMPLOYEE INVENTORY" />

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
									import {
	Badge,
	Button,
	CloseButton,
	Select,
	TextInput,
	Tooltip,
} from "@mantine/core"
import {ProductStatus} from "@prisma/client"
import {json} from "@remix-run/node"
import {Link, useLoaderData} from "@remix-run/react"
import {ExternalLinkIcon} from "lucide-react"
import * as React from "react"
import {EmptyState} from "~/components/EmptyState"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"
import {getAllCustomers} from "~/lib/user.server"

export async function loader() {
	const customers = await getAllCustomers()
	const checkedInProducts = await prisma.product.findMany({
		where: {
			Status: ProductStatus.CHECKED_IN,
		},
		orderBy: {
			UpdatedAt: "desc",
		},
		include: {
			_count: {
				select: {
					CheckOutRequests: true,
				},
			},
			User: {
				select: {
					Name: true,
				},
			},
		},
	})

	return json({
		checkedInProducts,
		customers,
	})
}

export default function OwnerInventory() {
	const {checkedInProducts, customers} = useLoaderData<typeof loader>()

	const [queryProduct, setQueryProduct] = React.useState("")
	const [queryUPC, setQueryUPC] = React.useState("")
	const [customerId, setCustomerId] = React.useState<
		(typeof customers)[number]["Id"] | null
	>(null)

	const filteredProducts = React.useMemo(() => {
		let _products = checkedInProducts
		const _queryProduct = queryProduct.trim()
		const _queryUPC = queryUPC.trim()

		if (_queryProduct) {
			_products = _products.filter((product) => {
				return product.Name.toLowerCase().includes(_queryProduct.toLowerCase())
			})
		}

		if (_queryUPC) {
			_products = _products.filter((product) => {
				return product.UPC.toLowerCase().includes(_queryUPC.toLowerCase())
			})
		}

		if (customerId) {
			_products = _products.filter((product) => {
				return product.UserId === customerId
			})
		}

		return _products
	}, [checkedInProducts, customerId, queryUPC, queryProduct])

	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="EMPLOYEE INVENTORY" />

					<div className="flex max-w-lg items-center gap-4">
						<TextInput
							label="UPC"
							value={queryUPC}
							onChange={(e) => setQueryUPC(e.currentTarget.value)}
							placeholder="Search by UPC"
							rightSectionPointerEvents="all"
							rightSection={
								<CloseButton
									aria-label="Clear input"
									onClick={() => setQueryUPC("")}
									style={{display: queryUPC ? undefined : "none"}}
								/>
							}
						/>

						<TextInput
							label="Product"
							value={queryProduct}
							onChange={(e) => setQueryProduct(e.currentTarget.value)}
							placeholder="Search by Product"
							rightSectionPointerEvents="all"
							rightSection={
								<CloseButton
									aria-label="Clear input"
									onClick={() => setQueryProduct("")}
									style={{display: queryProduct ? undefined : "none"}}
								/>
							}
						/>

						<Select
							label="Customer"
							value={customerId}
							onChange={setCustomerId}
							placeholder="Select a customer"
							clearable
							data={customers.map((customer) => ({
								value: customer.Id,
								label: customer.Name,
							}))}
						/>
					</div>

					{filteredProducts.length > 0 ? (
						<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
							<table className="w-full">
								<thead>
									<tr>
										<th className="px-4 py-2">UPC</th>
										<th className="px-4 py-2">Product</th>
										<th className="px-4 py-2">Quantity</th>
										<th className="px-4 py-2">Condition</th>
										<th className="px-4 py-2">Customer Name</th>
										<th className="px-4 py-2">
											<span className="sr-only">Actions</span>
										</th>
									</tr>
								</thead>

								<tbody>
									{filteredProducts.map((product) => (
										<tr key={product.Id}>
											<td className="border px-4 py-2">
												<Button
													variant="transparent"
													color="blue"
													size="compact-sm"
													component={Link}
													to={`upc/${product.UPC}`}
													rightSection={<ExternalLinkIcon size={18} />}
												>
													{product.UPC}
												</Button>
											</td>
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
											<td className="border px-4 py-2">
												<Tooltip
													label="Product already checked out!"
													disabled={product._count.CheckOutRequests === 0}
												>
													<div>
														<Button
															variant="white"
															component={Link}
															size="compact-sm"
															color="red"
															to={`/employee/check-in/${product.Id}`}
															disabled={product._count.CheckOutRequests > 0}
														>
															Edit
														</Button>
													</div>
												</Tooltip>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<EmptyState
							message={
								queryProduct
									? "No products found. Try a different search."
									: "No products found."
							}
						/>
					)}
				</div>
			</div>
		</>
	)
}		<td className="border px-4 py-2">John Doe</td>
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
}
