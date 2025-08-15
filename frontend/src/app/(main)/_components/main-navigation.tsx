"use client";

import { AppBrand } from "@/app/_components/app-brand";
import AppSearch from "@/app/_components/app-search";
import AuthDialog from "@/app/_components/auth-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useMainMenu } from "@/hooks/use-main-menu";
import { authClient } from "@/lib/auth-client";
import {
  AudioLinesIcon,
  ChevronDownIcon,
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  SearchIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

const MainNavigation = () => {
  const menus = useMainMenu();
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="px-4 md:px-6 sticky top-0 bg-background z-50">
      <div className="flex h-12 justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" variant="ghost" size="icon">
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {menus.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          className="py-1.5"
                          active={link.isActive}
                          asChild
                        >
                          <Link href={link.href}>{link.label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <AppBrand>
              <AppBrand.Icon size={25} strokeWidth={2.5} />
              <AppBrand.Link
                href="/"
                className="uppercase text-base tracking-widest"
              >
                Soundvibe
              </AppBrand.Link>
            </AppBrand>
            {/* Navigation menu */}
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-4">
                {menus.map((link, index) => (
                  <NavigationMenuItem key={index} className="h-full">
                    <NavigationMenuLink
                      active={link.isActive}
                      className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent font-medium hover:bg-transparent data-[active]:bg-transparent!"
                      asChild
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center flex-1">
          <AppSearch>
            <AppSearch.Input
              value=""
              onChange={(e) => console.log("search")}
              placeholder="Search"
              className="h-9"
            />
            <AppSearch.Loading />
            <AppSearch.Button onClick={() => console.log(`search for`)}>
              <SearchIcon className="size-6" />
            </AppSearch.Button>
            <AppSearch.Results>
              <AppSearch.Item>Recent Search 1</AppSearch.Item>
              <AppSearch.Item>Recent Search 2</AppSearch.Item>
            </AppSearch.Results>
          </AppSearch>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <NavigationMenu className="h-full *:h-full max-md:hidden">
            <NavigationMenuList className="h-full gap-4">
              <NavigationMenuItem className="h-full">
                <NavigationMenuLink
                  className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent font-medium hover:bg-transparent data-[active]:bg-transparent!"
                  asChild
                >
                  <Link href="/upload">Upload</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ) : session?.user ? (
            <div className="flex gap-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <Avatar>
                      <AvatarImage src="./avatar.jpg" alt="Profile image" />
                      <AvatarFallback>KK</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                      size={16}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserIcon
                        size={16}
                        className="opacity-60 fill-foreground stroke-foreground"
                        aria-hidden="true"
                      />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HeartIcon
                        size={16}
                        className="opacity-60 fill-foreground stroke-foreground"
                        aria-hidden="true"
                      />
                      <span>Likes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CopyIcon
                        size={16}
                        className="opacity-60 fill-foreground stroke-foreground"
                        aria-hidden="true"
                      />
                      <span>Playlists</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserCheckIcon
                        size={16}
                        className="opacity-60 stroke-foreground fill-foreground"
                        aria-hidden="true"
                      />
                      <span>Following</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AudioLinesIcon
                        size={16}
                        strokeWidth={3}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                      <span>Tracks</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shadow-none"
                    aria-label="Open edit menu"
                  >
                    <EllipsisIcon size={16} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <AuthDialog>
                <Button asChild variant="ghost" size="sm" className="text-sm">
                  <a href="#">Sign In</a>
                </Button>
              </AuthDialog>
              <AuthDialog>
                <Button asChild size="sm" className="text-sm">
                  <a href="#">Get Started</a>
                </Button>
              </AuthDialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
