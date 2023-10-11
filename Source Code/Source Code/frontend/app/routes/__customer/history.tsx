import {
	Badge,
	Button,
	CloseButton,
	Group,
	Radio,
	TextInput,
} from "@mantine/core"
import type {DataFunctionArgs} from "@remix-run/node"
import {json} from "@remix-run/node"
import {Link, useLoaderData} from "@remix-run/react"
import {ExternalLinkIcon} from "lucide-react"
import {EmptyState} from "~/components/ui/EmptyState"
import {PageHeading} from "~/components/ui/PageHeading"
import {prisma} from "~/lib/db.server"
import {requireUserId} from "~/session.server"
import {
	checkOutStatusColorLookup,
	checkOutStatusLabelLookup,
	formatDateTime,
} from "~/utils/misc"
import * as React from "react"
import {CheckOutStatus} from "@prisma/client"

export async function loader({request}: DataFunctionArgs) {
	const userId = await requireUserId(request)

	const requests = await prisma.checkOutRequest.findMany({
		where: {
			userId,
		},
		include: {
			Product: true,
		},
	})
	return json({
		requests,
	})
}
