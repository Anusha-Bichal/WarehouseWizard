import type {LoaderArgs, SerializeFrom} from "@remix-run/node"
import {json, redirect} from "@remix-run/node"
import {Outlet} from "@remix-run/react"
import {SettingsIcon} from "lucide-react"
import {Nav, type NavMenuItems} from "~/components/Nav"
import {isEmployee, isOwner, requireUserId} from "~/session.server"

export type CustomerLoaderData = SerializeFrom<typeof loader>
export const loader = async ({request}: LoaderArgs) => {
	await requireUserId(request)

	if (await isOwner(request)) {
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
				href: `/`,
				icon: <SettingsIcon width={18} />,
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
