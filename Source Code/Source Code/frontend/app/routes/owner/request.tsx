/*import {Group, Radio} from "@mantine/core"
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
}*/

import {Badge, Button, Divider, Group, Modal, Radio} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {CheckOutStatus} from "@prisma/client"
import type {ActionArgs, SerializeFrom} from "@remix-run/node"
import {json} from "@remix-run/node"
import {useFetcher, useLoaderData} from "@remix-run/react"
import {EmptyState} from "~/components/EmptyState"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"
import {
	checkOutStatusColorLookup,
	checkOutStatusLabelLookup,
} from "~/utils/misc"

export async function loader() {
	const requests = await prisma.checkOutRequest.findMany({
		include: {
			user: true,
			Product: true,
		},
	})

	return json({
		requests,
	})
}

type ActionData = {
	success: boolean
	fieldErrors?: Record<string, string>
}

export async function action({request}: ActionArgs) {
	const formData = await request.formData()

	const requestId = formData.get("requestId")?.toString()

	if (!requestId) {
		return json<ActionData>({
			success: false,
			fieldErrors: {
				productId: "Request ID is required",
			},
		})
	}

	const intent = formData.get("intent")?.toString()

	if (intent === "approve") {
		await prisma.checkOutRequest.update({
			where: {
				Id: requestId,
			},
			data: {
				Status: CheckOutStatus.CHECKED_OUT,
				Product: {
					update: {
						CheckedOutTime: new Date(),
						Status: CheckOutStatus.CHECKED_OUT,
					},
				},
			},
		})

		return json<ActionData>({
			success: true,
		})
	}

	return json<ActionData>({
		success: true,
	})
}

export default function OwnerRequest() {
	const {requests} = useLoaderData<typeof loader>()

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

					{requests.length > 0 ? (
						<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
							<table className="w-full">
								<thead>
									<tr>
										<th className="px-4 py-2">Tracking ID</th>
										<th className="px-4 py-2">Customer Name</th>
										<th className="px-4 py-2">Product</th>
										<th className="px-4 py-2">Status</th>
										<th className="px-4 py-2">Details</th>
										<th className="px-4 py-2"></th>
									</tr>
								</thead>
								<tbody>
									{requests.map((request) => (
										<RequestRow key={request.Id} request={request} />
									))}
								</tbody>
							</table>
						</div>
					) : (
						<EmptyState message="No products. Please check back later" />
					)}
				</div>
			</div>
		</>
	)
}

function RequestRow({
	request,
}: {
	request: SerializeFrom<typeof loader>["requests"][0]
}) {
	const fetcher = useFetcher<ActionData>()
	const isSubmitting = fetcher.state !== "idle"

	const [isModalOpen, handleModal] = useDisclosure(false)

	return (
		<>
			<tr>
				<td className="border px-4 py-2">-</td>
				<td className="border px-4 py-2">{request.user.Name}</td>
				<td className="border px-4 py-2">{request.Product.Name}</td>
				<td className="border px-4 py-2 text-center">
					<Badge
						variant="light"
						color={checkOutStatusColorLookup[request.Status]}
						radius="xs"
					>
						{checkOutStatusLabelLookup[request.Status]}
					</Badge>
				</td>
				<td className="border px-4 py-2">
					<button
						className="focus:none text-sm text-blue-700 hover:underline"
						onClick={handleModal.open}
					>
						Check
					</button>
				</td>
				<td className="border px-4 py-2">
					{request.Status === CheckOutStatus.PENDING && (
						<>
							<fetcher.Form method="POST" className="flex items-center gap-4">
								<input hidden name="requestId" defaultValue={request.Id} />
								<input
									hidden
									name="productId"
									defaultValue={request.ProductId}
								/>
								<Button
									compact
									type="submit"
									variant="white"
									name="intent"
									value="approve"
									color="green"
									loading={isSubmitting}
								>
									Approve
								</Button>
							</fetcher.Form>
						</>
					)}
				</td>
			</tr>

			<Modal
				title="Shipping Details"
				opened={isModalOpen}
				onClose={handleModal.close}
			>
				<Divider />

				<div className="mt-8 flex flex-col gap-4">
					<p className="flex items-center gap-2">
						<strong>Name:</strong>
						<span>{request.CustomerName}</span>
					</p>
					<p className="flex items-center gap-2">
						<strong>Phone:</strong>
						<span>{request.CustomerPhone}</span>
					</p>
					<p className="flex items-center gap-2">
						<strong>Address 1:</strong>
						<span>{request.CustomerAddress1}</span>
					</p>
					{request.CustomerAddress2 && (
						<p className="flex items-center gap-2">
							<strong>Address 2:</strong>
							<span>{request.CustomerAddress2}</span>
						</p>
					)}

					<p className="flex items-center gap-2">
						<strong>City:</strong>
						<span>{request.CustomerCity}</span>
					</p>

					<p className="flex items-center gap-2">
						<strong>State:</strong>
						<span>{request.CustomerState}</span>
					</p>

					<p className="flex items-center gap-2">
						<strong>Zip:</strong>
						<span>{request.CustomerZip}</span>
					</p>
				</div>
			</Modal>
		</>
	)
}

