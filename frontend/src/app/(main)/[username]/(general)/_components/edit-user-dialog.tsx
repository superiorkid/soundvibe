"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateCurrentUserProfile,
  useUserByUsername,
} from "@/hooks/tanstack/user";
import { useFileUpload } from "@/hooks/use-file-upload";
import { isAbsoluteUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { editUserSchema, TEditUserSchema } from "../edit-user-schema";

interface EditUserDialogProps {
  children: React.ReactNode;
  username: string;
}

const EditUserDialog = ({ children, username }: EditUserDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useUserByUsername(username);

  const defaultValues = useMemo<TEditUserSchema>(
    () => ({
      displayName: user?.data?.name || "",
      firstName: user?.data?.firstName || "",
      lastName: user?.data?.lastName || "",
      bio: user?.data?.bio || "",
      city: user?.data?.city || "",
      country: user?.data?.country || "",
      newProfileImage: undefined,
      existingProfileImage: user?.data?.image || undefined,
    }),
    [user?.data]
  );

  const form = useForm<TEditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues.existingProfileImage ?? null
  );

  useEffect(() => {
    if (user?.data) {
      form.reset(defaultValues);
      setPreviewUrl(defaultValues.existingProfileImage ?? null);
    }
  }, [user?.data, form, defaultValues]);

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      maxFiles: 1,
      onFilesAdded(addedFiles) {
        const file = addedFiles.at(0)?.file as File;
        if (!file) return;

        form.setValue("newProfileImage", file);
        form.setValue("existingProfileImage", undefined);

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      },
    });

  const handleDeleteImage = () => {
    setPreviewUrl(null);
    form.setValue("newProfileImage", undefined);
    form.setValue("existingProfileImage", undefined);

    if (files.length > 0) {
      removeFile(files[0].id);
    }
  };

  const onCancel = () => {
    form.reset(defaultValues);
    setPreviewUrl(defaultValues.existingProfileImage ?? null);
    setOpenDialog(false);
  };

  const { isPending, updateUserProfileMutation } = useUpdateCurrentUserProfile({
    onSuccess: () => setOpenDialog(false),
  });

  const onSubmit = (values: TEditUserSchema) => {
    const formData = new FormData();

    formData.append("displayName", values.displayName);
    if (values.bio) formData.append("bio", values.bio);
    if (values.city) formData.append("city", values.city);
    if (values.country) formData.append("country", values.country);
    if (values.firstName) formData.append("firstName", values.firstName);
    if (values.lastName) formData.append("lastName", values.lastName);

    if (values.newProfileImage instanceof File) {
      formData.append("newProfileImage", values.newProfileImage);
    } else if (values.existingProfileImage) {
      formData.append("existingProfileImage", values.existingProfileImage);
    } else {
      formData.append("existingProfileImage", "");
    }

    updateUserProfileMutation(formData);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[776px] rounded-sm top-[8%] left-[50%] translate-x-[-50%] translate-y-[-0%] data-[state=open]:slide-in-from-top-90 data-[state=closed]:slide-out-to-top-90 duration-400">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit your profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex gap-8 mt-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="size-56 relative rounded-full overflow-hidden">
              {previewUrl ? (
                <Image
                  fill
                  src={
                    previewUrl
                      ? isAbsoluteUrl(previewUrl)
                        ? previewUrl
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${user?.data?.id}`
                      : "https://github.com/shadcn.png"
                  }
                  alt="profile image"
                  className="object-cover"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    disabled={isPending}
                  >
                    {previewUrl ? "Change image" : "Upload image"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={openFileDialog}>
                    {previewUrl ? "Replace Image" : "Upload Image"}
                  </DropdownMenuItem>
                  {previewUrl && (
                    <DropdownMenuItem onClick={handleDeleteImage}>
                      Delete Image
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload profile image"
                disabled={isPending}
                tabIndex={-1}
              />
            </div>

            <div className="flex-1 space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Display name<span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  disabled={isPending}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 items-center">
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
