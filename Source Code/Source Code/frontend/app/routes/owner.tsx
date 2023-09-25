import type {LoaderArgs, SerializeFrom} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {Outlet} from "@remix-run/react"
import {CheckSquareIcon, ReceiptIcon, SettingsIcon} from "lucide-react"
import {Nav, type NavMenuItems} from "~/components/Nav"
import {isCustomer, isEmployee, requireUserId} from "~/session.server"

export type OwnerLoaderData = SerializeFrom<typeof loader>
export const loader = async ({request}: LoaderArgs) => {
	await requireUserId(request)

	if (await isCustomer(request)) {
		return redirect("/owner")
	} else if (await isEmployee(request)) {
		return redirect("/employee")
	}

	return json({})
}

const navMenu: NavMenuItems = [
	{
		items: [
			{
				name: "Inventory",
				href: `/owner`,
				icon: <SettingsIcon width={18} />,
			},
			{
				name: "Check In",
				href: `/owner/check-in`,
				icon: <CheckSquareIcon width={18} />,
			},
			{
				name: "Request",
				href: `/owner/request`,
				icon: <ReceiptIcon width={18} />,
			},
		],
	},
]

export default function AppLayout() {
	return (
		<>
			<div>
				<Nav menuItems={navMenu} />

				<div className="min-h-screen bg-stone-50 sm:pl-64">
					<Outlet />
				</div>
			</div>
		</>
	)
}
