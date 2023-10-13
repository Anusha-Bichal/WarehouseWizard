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