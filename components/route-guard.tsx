"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "./ui/8bit/spinner";

const PUBLIC_ROUTES = ["/", "/signup", "/login"];
const DEFAULT_PUBLIC_ROUTE = "/";
const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) return;


    if (isSignedIn && isPublicRoute) {
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    } else if (!isSignedIn && !isPublicRoute) {
      router.replace(DEFAULT_PUBLIC_ROUTE);
    } 
  }, [isLoading, isSignedIn, pathname, router]);

  const isRedirecting = (isSignedIn && isPublicRoute) || (!isSignedIn && !isPublicRoute) 

  if (isLoading || isRedirecting) return <Spinner variant="diamond" className="size-40 w-screen h-screen"/>;

  return <>{children}</>;
}
