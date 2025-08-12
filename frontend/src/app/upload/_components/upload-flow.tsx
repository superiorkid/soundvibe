"use client";

import { Form } from "@/components/ui/form";
import { UploadStepEnum } from "@/enums/upload-step-enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { TUploadSchema, uploadSchema } from "../upload-schema";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";

const UploadFlow = () => {
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
      prefix: "",
      genre: "",
      description: "",
      additionalTags: [],
    },
  });

  const onSubmit = (values: TUploadSchema) => {
    console.log(values);
  };

  console.log("errors", form.formState.errors);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === UploadStepEnum.upload_audio && <Step1 onNext={nextStep} />}
        {step === UploadStepEnum.basic_information && (
          <Step2 onNext={nextStep} onBack={prevStep} />
        )}
        {step === UploadStepEnum.confirm && <Step3 onBack={prevStep} />}
      </form>
    </Form>
  );
};

export default UploadFlow;
