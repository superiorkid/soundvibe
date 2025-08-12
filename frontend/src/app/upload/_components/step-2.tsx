"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tag, TagInput } from "emblor";
import { CameraIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { H3, P } from "shadcn-typography";
import { TUploadSchema } from "../upload-schema";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const Step2 = ({ onNext, onBack }: Step2Props) => {
  const [exampleTags, setExampleTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useFormContext<TUploadSchema>();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <H3 className="text-3xl font-bold">Basic Info</H3>
        <P className="text-muted-foreground tracking-wide font-medium">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut id
          pariatur deleniti.
        </P>
      </div>

      <div className="flex space-x-6">
        <div className="size-96 flex justify-center items-end pb-5 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600">
          <Button size="lg" type="button">
            <CameraIcon size={18} strokeWidth={2} className="mr-1" />
            Update image
          </Button>
        </div>
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                soundcloud.com/schelpcenter/white-noise
              </p>
              <Button variant="outline" size="icon" type="button">
                <PencilIcon size={18} strokeWidth={2} />
                <span className="sr-only">Edit prefix</span>
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Genre <span className="text-rose-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalTags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Tags</FormLabel>
                <FormControl>
                  <TagInput
                    tags={field.value!}
                    setTags={(newTags) => {
                      field.onChange(newTags);
                    }}
                    placeholder="Add a tag"
                    styleClasses={{
                      tagList: {
                        container: "gap-1",
                      },
                      input:
                        "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      tag: {
                        body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                        closeButton:
                          "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                      },
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    inlineTags={false}
                    inputFieldPosition="top"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                  <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2;
