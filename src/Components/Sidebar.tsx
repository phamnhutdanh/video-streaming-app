"use client"
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { signIn, useSession } from "next-auth/react";
import Button from "./Buttons/Button";

import {
  ClockRewind,
  Folder,
  HelpCircle,
  Home,
  Lock,
  MessagePlusSquare,
  Settings,
  ThumbsUp,
  UserCheck,
  File,
  VideoRecorder,
  User,
  Brush,
  LogOut,
  Close,
} from "./Icons/Icons";
import { Logo } from "./Icons/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserImage } from "./Components";

interface NavigationItem {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
//   isOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}
export default function Sidebar({
//   isOpen,
//   setSidebarOpen,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const pathname = usePathname()
  const DesktopNavigation: NavigationItem[] = [
    {
      name: "Home",
      path: `/`,
      icon: (className) => <Home className={className} />,
      current: pathname === `/`,
    },
    {
      name: "Liked Videos",
      path: userId ? `/playlist/LikedVideos` : "sign-in",
      icon: (className) => <ThumbsUp className={className} />,
      current: pathname === `/playlist/LikedVideos`,
    },
    {
      name: "History",
      path: userId ? `/playlist/History` : "sign-in",
      icon: (className) => <ClockRewind className={className} />,
      current: pathname === `/playlist/History`,
    },
    {
      name: "Your Videos",
      path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
      icon: (className) => <VideoRecorder className={className} />,
      current: pathname === `/${String(userId)}/ProfileVideos`,
    },
    {
      name: "Library",
      path: userId ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
      icon: (className) => <Folder className={className} />,
      current: pathname === `/${String(userId)}/ProfilePlaylists`,
    },
    {
      name: "Following",
      path: userId ? `/${String(userId)}/ProfileFollowing` : "sign-in",
      icon: (className) => <UserCheck className={className} />,
      current: pathname === `/${String(userId)}/ProfileFollowing`,
    },
  ];
  const SignedInMobileNavigation: NavigationItem[] = [
    {
      name: "Profile",
      path: `/${String(userId)}/ProfileVideos`,
      icon: (className) => <User className={className} />,
      current: pathname === `/Profile`,
    },
    {
      name: "Creator Studio",
      path: `/Dashboard`,
      icon: (className) => <Brush className={className} />,
      current: pathname === `/CreatorStudio`,
    },
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
      current: pathname === `/Blog/Help`,
    },
    {
      name: "Settings",
      path: `/Settings`,
      icon: (className) => <Settings className={className} />,
      current: pathname === `/Settings`,
    },
    {
      name: "Feedback",
      path: `mailto:vidchill@vidchill.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
      current: pathname === `/Feedback`,
    },
  ];
  const SignedOutMobileNavigation: NavigationItem[] = [
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
      current: pathname === `/Blog/Help`,
    },

    {
      name: "Feedback",
      path: `mailto:vidchill@vidchill.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
      current: pathname === `/Feedback`,
    },
  ];

  const mobileNavigation = sessionData
    ? SignedInMobileNavigation
    : SignedOutMobileNavigation;

  useEffect(() => {
    DesktopNavigation.forEach((nav) => {
      nav.current = nav.path === pathname;
    });
    mobileNavigation.forEach((nav) => {
      nav.current = nav.path === pathname;
    });
  }, [pathname]);

  return (
    <>
      {/* Static sidebar for desktop */}
      <div
        className={classNames(
          closeSidebar ? "lg:w-20" : "lg:w-56",
          "bottom-0 top-16  hidden lg:fixed lg:z-40 lg:flex lg:flex-col"
        )}
      >
        {/*  Sidebar component FOR DESKTOP, swap this element with another sidebar if you like */}

        <div className="flex grow flex-col gap-y-5 overflow-y-auto border border-gray-200 bg-white px-6 pb-4">
          <nav className="flex flex-1 flex-col pt-8">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1 ">
                  {DesktopNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.path === "sign-in") {
                            void signIn();
                          } else {
                            void router.push(item.path || "/");
                          }
                        }}
                        className={classNames(
                          item.current
                            ? " bg-gray-50 text-primary-600"
                            : " text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        {item.current
                          ? item.icon("h-5 w-5 shrink-0 stroke-primary-600 ")
                          : item.icon(
                              "h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600"
                            )}
                        <p className={classNames(closeSidebar ? "hidden" : "")}>
                          {item.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="mt-auto">
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    {
                      sessionData
                        ? void router.push("/Settings")
                        : void signIn();
                    }
                  }}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <Settings
                    className={
                      "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                    }
                  />
                  <p className={classNames(closeSidebar ? "hidden" : "")}>
                    Settings
                  </p>
                </Link>
                <Link
                  href="/Blog/Help"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <HelpCircle
                    className={
                      "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                    }
                  />
                  <p className={classNames(closeSidebar ? "hidden" : "")}>
                    Help
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
     
    </>
  );
}