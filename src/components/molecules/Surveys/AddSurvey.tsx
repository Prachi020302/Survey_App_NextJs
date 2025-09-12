"use client";

import React, { useCallback } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Button, Typography, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldType } from "@/types/Survey";
import FormBuilder from "@/components/molecules/Surveys/FormBuilder";
import FormProvider from "@/shared/Hook-form/FormProvider";
import { Surveys } from "@/locales/surveys";
import { dispatch } from "@/app/redux/store";
import { addSurvey } from "@/app/redux/slices/surveySlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddSurvey = () => {
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      fields: [] as Field[],
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch, control } = methods;

  const [fields, title] = watch(["fields", "title"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addField = (type: FieldType) => {
    setValue("fields", [
      ...fields,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: "",
        type,
      },
    ]);
  };

  const updateField = useCallback(
    (id: string, label: string, options?: string[]) => {
      setValue(
        "fields",
        fields.map((f) =>
          f.id === id ? { ...f, label, options: options || f.options } : f
        )
      );
    },
    [fields, setValue]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setValue(
        "fields",
        fields.filter((f) => f.id !== id)
      );
    },
    [fields, setValue]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over || active.id === over.id) return;

      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setValue("fields", arrayMove(fields, oldIndex, newIndex));
      }
    },
    [fields, setValue]
  );

  const onSubmit = async (data: {
    title: string;
    description: string;
    fields: Field[];
  }) => {
    const surveyData = {
      title: data.title,
      description: data.description,
      questions: data.fields,
    };

    const response = await dispatch(addSurvey(surveyData));

    if (addSurvey.fulfilled.match(response)) {
      toast.success("Survey created successfully");
      router.push("/surveys");
    }
    if (addSurvey.rejected.match(response)) {
      toast.error(response.payload?.message || "Failed to create survey");
    }
  };

  return (
    <FormProvider methods={methods}>
      <Box>
        <Typography data-testid="add-survey-title" variant="h5" gutterBottom>
          {Surveys.addSurvey.title}
        </Typography>

        {/* Survey Title and Description Fields */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Survey title is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                data-testid="title"
                {...field}
                label="Survey Title"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                data-testid="description"
                {...field}
                label="Survey Description"
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            data-testid="add-text-field"
            variant="outlined"
            onClick={() => addField("text")}
          >
            + {Surveys.addSurvey.textFieldLabel}
          </Button>
          <Button
            data-testid="add-number-field"
            variant="outlined"
            onClick={() => addField("number")}
          >
            + {Surveys.addSurvey.numberFieldLabel}
          </Button>
          <Button
            data-testid="add-checkbox-field"
            variant="outlined"
            onClick={() => addField("checkbox")}
          >
            + {Surveys.addSurvey.checkboxFieldLabel}
          </Button>
          <Button
            data-testid="add-select-field"
            variant="outlined"
            onClick={() => addField("select")}
          >
            + {Surveys.addSurvey.selectFieldLabel}
          </Button>
          <Button
            data-testid="add-radio-field"
            variant="outlined"
            onClick={() => addField("radio")}
          >
            + {Surveys.addSurvey.radioFieldLabel}
          </Button>
        </Box>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field) => (
              <FormBuilder
                key={field.id}
                field={field}
                onUpdate={updateField}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
        {title || fields.length > 0 ? (
          <Button
            data-testid="add-survey-submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            {Surveys.addSurvey.submitButton}
          </Button>
        ) : (
          <Typography
            data-testid="no-survey"
            variant="subtitle1"
            sx={{ mt: 2 }}
          >
            {Surveys.addSurvey.noSurveyText}
          </Typography>
        )}
      </Box>
    </FormProvider>
  );
};

export default AddSurvey;
