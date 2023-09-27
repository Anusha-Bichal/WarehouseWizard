import {TextInput} from "@mantine/core"
import {SearchIcon} from "lucide-react"
import {PageHeading} from "~/components/ui/PageHeading"

export default function CustomerInventory() {
	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="CUSTOMER INVENTORY" />

					<div className="flex items-center gap-8">
						<TextInput
							label="Warehouse Location"
							placeholder="Search locations"
							rightSection={<SearchIcon size={18} className="text-gray-500" />}
						/>
						<TextInput
							label="UPC"
							placeholder="Search UPC"
							rightSection={<SearchIcon size={18} className="text-gray-500" />}
						/>
						<TextInput
							label="Product Name"
							placeholder="Search product name"
							rightSection={<SearchIcon size={18} className="text-gray-500" />}
						/>
					</div>

					<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table className="w-full">
							<thead>
								<tr>
									<th className="px-4 py-2">Warehouse Location</th>
									<th className="px-4 py-2">UPC</th>
									<th className="px-4 py-2">Product Name</th>
									<th className="px-4 py-2">Product Quantity</th>
									<th className="px-4 py-2">Checkout Request</th>
									<th className="px-4 py-2">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border px-4 py-2">Maryville</td>
									<td className="border px-4 py-2">124563</td>
									<td className="border px-4 py-2">Iphone Xr</td>
									<td className="border px-4 py-2">10</td>
									<td className="border px-4 py-2">5</td>
									<td className="border px-4 py-2">
										Checked In At: 10 am 05/15/2023
										<br />
										Checked Out: 3 pm 05/16/2023
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}