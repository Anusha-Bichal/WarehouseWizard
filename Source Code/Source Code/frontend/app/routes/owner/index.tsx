import {PageHeading} from "~/components/ui/PageHeading"

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
}
