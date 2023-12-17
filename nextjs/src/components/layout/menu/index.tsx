import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { uniqueId } from "lodash";
import Link, { LinkProps } from "next/link";
import { Fragment, forwardRef } from "react";

type buttonType = React.ButtonHTMLAttributes<HTMLButtonElement>;
type linkType = React.ForwardRefExoticComponent<
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
        LinkProps & {
            children?: React.ReactNode;
        } & React.RefAttributes<HTMLAnchorElement>
>;

type actionType = { name: string } & (buttonType | linkType);

type Props = { groups: { name: string; actions: actionType[] }[] };

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className: string;
}

export default function TailwindMenu({ groups }: Props) {
    return (
        <Menu
            as="div"
            className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex items-center rounded-full hover:bg-gray-100 p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200">
                    {groups.map((group) => (
                        <div
                            key={uniqueId(group.name)}
                            className="py-1">
                            {group.actions.map((action) => (
                                <Menu.Item key={uniqueId(action.name)}>
                                    {({ active }) => {
                                        if ("href" in action && action.href) {
                                            const props = action as LinkProps;

                                            return (
                                                <Link
                                                    {...props}
                                                    className={clsx(
                                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                        "inline-flex items-center w-full px-4 py-2 text-sm"
                                                    )}>
                                                    {action.name}
                                                </Link>
                                            );
                                        }

                                        const props = action as buttonType;

                                        return (
                                            <Button
                                                {...props}
                                                type="button"
                                                className={clsx(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "inline-flex items-center w-full px-4 py-2 text-sm"
                                                )}>
                                                {action.name}
                                            </Button>
                                        );
                                    }}
                                </Menu.Item>
                            ))}
                        </div>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ onClick, className, type, ...props }, ref) => (
    <button
        ref={ref}
        className={className}
        onClick={onClick}
        {...props}
    />
));
Button.displayName = "Button";
