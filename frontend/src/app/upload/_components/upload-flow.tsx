"use client";

import { Form } from "@/components/ui/form";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { UploadStepEnum } from "@/enums/upload-step-enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TUploadSchema, uploadSchema } from "../upload-schema";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";

const stepList = Object.keys(UploadStepEnum).map((key, index) => ({
  index,
  value: UploadStepEnum[key as keyof typeof UploadStepEnum],
  title: key.replaceAll("_", " "),
}));

const UploadFlow = () => {
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useQueryState(
    "step",
    parseAsStringEnum<UploadStepEnum>(
      Object.values(UploadStepEnum)
    ).withDefault(UploadStepEnum.upload_audio)
  );

  const form = useForm<TUploadSchema>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      audio: undefined,
      cover: undefined,
      title: "",
      genre: "0",
      description: "",
      additionalTags: [],
    },
  });

  // guard against accessing steps without filling previous ones
  useEffect(() => {
    const values = form.getValues();

    if (step === UploadStepEnum.basic_information && !values.audio) {
      setStep(UploadStepEnum.upload_audio);
    } else if (
      step === UploadStepEnum.confirm &&
      (!values.audio || !values.title || !values.genre || !values.description)
    ) {
      setStep(
        !values.audio
          ? UploadStepEnum.upload_audio
          : UploadStepEnum.basic_information
      );
    }

    setLoading(false);
  }, [step, setStep, form]);

  const onSubmit = (values: TUploadSchema) => {
    console.log(values);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof TUploadSchema)[] = [];

    if (step === UploadStepEnum.upload_audio) {
      fieldsToValidate = ["audio"];
    } else if (step === UploadStepEnum.basic_information) {
      fieldsToValidate = ["title", "genre", "description"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (step === UploadStepEnum.upload_audio) {
        setStep(UploadStepEnum.basic_information);
      } else if (step === UploadStepEnum.basic_information) {
        setStep(UploadStepEnum.confirm);
      }
    }
  };

  const prevStep = () => {
    if (step === UploadStepEnum.basic_information) {
      setStep(UploadStepEnum.upload_audio);
    } else if (step === UploadStepEnum.confirm) {
      setStep(UploadStepEnum.basic_information);
    }
  };

  const currentIndex = stepList.findIndex((s) => s.value === step);

  const handleStepChange = async (targetStepNumber: number) => {
    const targetIndex = targetStepNumber - 1;

    if (targetIndex > currentIndex) {
      if (currentIndex === 0) {
        const ok = await form.trigger(["audio"]);
        if (!ok) return;
      }
      if (currentIndex === 1) {
        const ok = await form.trigger(["title", "genre", "description"]);
        if (!ok) return;
      }
    }
    setStep(stepList[targetIndex].value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 flex-col space-y-2">
        <Loader2Icon size={35} className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Stepper value={currentIndex + 1} onValueChange={handleStepChange}>
        {stepList.map(({ index, title }) => (
          <StepperItem
            key={index + 1}
            step={index + 1}
            className="not-last:flex-1 max-md:items-start"
          >
            <StepperTrigger className="rounded max-md:flex-col">
              <StepperIndicator />
              <div className="text-center md:text-left">
                <StepperTitle className="capitalize">{title}</StepperTitle>
              </div>
            </StepperTrigger>
            {index < stepList.length - 1 && (
              <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
            )}
          </StepperItem>
        ))}
      </Stepper>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          {step === UploadStepEnum.upload_audio && <Step1 onNext={nextStep} />}
          {step === UploadStepEnum.basic_information && (
            <Step2 onNext={nextStep} onBack={prevStep} />
          )}
          {step === UploadStepEnum.confirm && <Step3 onBack={prevStep} />}
        </form>
      </Form>
    </div>
  );
};

export default UploadFlow;
