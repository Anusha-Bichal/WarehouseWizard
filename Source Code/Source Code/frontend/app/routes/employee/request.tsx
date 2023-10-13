import {Group, Radio} from "@mantine/core"
import {PageHeading} from "~/components/ui/PageHeading"

export default function OwnerInventory() {
	return (
		<>
			<div className="flex max-w-screen-xl flex-col gap-12 p-10">
				<div className="flex flex-col gap-12">
					<PageHeading title="REQUEST" />

					<Radio.Group defaultValue="all">
						<Group mt="xs">
							<Radio value="all" label="All" />
							<Radio value="pending" label="Pending" />
							<Radio value="processed" label="Processed" />
						</Group>
					</Radio.Group>

		                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table className="w-full">
							<thead>
								<tr>
									<th className="px-4 py-2">Tracking ID</th>
									<th className="px-4 py-2">Customer Name</th>
									<th className="px-4 py-2">Quality</th>
									<th className="px-4 py-2">Status, Date and Time</th>
									<th className="px-4 py-2">Product Name</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border px-4 py-2">TRK123</td>
									<td className="border px-4 py-2">Amit Patel</td>
									<td className="border px-4 py-2">85</td>
									<td className="border px-4 py-2">
										Pending, 12/12/2021 10:30 AM
									</td>
									<td className="border px-4 py-2">iPhone 12 Pro Max</td>
								</tr>
								<tr>
									<td className="border px-4 py-2">TRK124</td>
									<td className="border px-4 py-2">Sunita Sharma</td>
									<td className="border px-4 py-2">90</td>
									<td className="border px-4 py-2">
										Processed, 12/12/2021 11:00 AM
									</td>
									<td className="border px-4 py-2">OnePlus 9 Pro</td>
								</tr>
								<tr>
									<td className="border px-4 py-2">TRK125</td>
									<td className="border px-4 py-2">Rajesh Gupta</td>
									<td className="border px-4 py-2">80</td>
									<td className="border px-4 py-2">
										Pending, 12/12/2021 11:30 AM
									</td>
									<td className="border px-4 py-2">Samsung Galaxy Note 20</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}
