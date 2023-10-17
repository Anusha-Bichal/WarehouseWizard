import {
	Badge,
	Button,
	CloseButton,
	Divider,
	Group,
	Modal,
	Radio,
	TextInput,
} from "@mantine/core"
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
	generateMockUPSTrackingId,
} from "~/utils/misc"
import * as React from "react"
import {sendMail} from "~/lib/mail.server"

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
		await prisma.$transaction(async (tx) => {
			const request = await tx.checkOutRequest.update({
				where: {
					Id: requestId,
				},
				data: {
					Status: CheckOutStatus.CHECKED_OUT,
					TrackingId: generateMockUPSTrackingId(),
				},
				include: {
					Product: true,
					user: true,
				},
			})

			await sendMail(
				request.user.Email,
				"Your order has been shipped",
				`Your order for ${request.Product.Name} has been shipped. Tracking ID: ${request.TrackingId}`
			)
		})

		return json<ActionData>({
			success: true,
		})
	}

	return json<ActionData>({
		success: true,
	})
}
