"use client";

import React, { memo, useCallback, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { Add, DragIndicator } from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field } from "@/types/Survey";
import DeleteButton from "@/components/Atoms/DeleteButton";
import { Controller, useFormContext } from "react-hook-form";

const FormBuilder = ({
  field,
  onUpdate,
  onDelete,
}: {
  field: Field;
  onUpdate: (id: string, label: string, options?: string[]) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "16px",
  };

  const [editing, setEditing] = useState(false);
  const [optionEditingIndex, setOptionEditingIndex] = useState<number | null>(
    null
  );

  // React Hook Form
  const { control } = useFormContext();

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(field.id, e.target.value, field.options);
  };

  const handleLabelDoubleClick = () => {
    setEditing(true);
  };

  const handleLabelBlur = () => {
    setEditing(false);
    // If label is empty or just "Untitled", clear it
    if (field.label === "Untitled" || field.label.trim() === "") {
      onUpdate(field.id, "", field.options);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!field.options) return;
    const updatedOptions = [...field.options];
    updatedOptions[index] = value;
    onUpdate(field.id, field.label, updatedOptions);
  };

  const addOption = () => {
    const updatedOptions = [...(field.options || []), "New Option"];
    onUpdate(field.id, field.label, updatedOptions);
  };

  const deleteOption = (index: number) => {
    if (!field.options) return;
    const updatedOptions = field.options.filter((_, i) => i !== index);
    onUpdate(field.id, field.label, updatedOptions);
  };

  const startEditingOption = (index: number) => {
    setOptionEditingIndex(index);
  };

  const stopEditingOption = useCallback(() => {
    setOptionEditingIndex(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setEditing(false);
      }
    },
    [setEditing]
  );

  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent>
        {/* Field Label - editable on double click */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              data-testid="drag-button"
              {...attributes}
              {...listeners}
              sx={{ cursor: "grab" }}
            >
              <DragIndicator />
            </IconButton>
            {editing ? (
              <TextField
                data-testid="edit-label"
                value={field.label}
                onChange={handleLabelChange}
                onBlur={handleLabelBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                fullWidth
                size="small"
              />
            ) : (
              <Typography
                data-testid={field.label ? field.label : "Untitled"}
                variant="subtitle1"
                onDoubleClick={handleLabelDoubleClick}
                sx={{ cursor: "pointer", flex: 1 }}
              >
                {field.label || "Untitled"}
              </Typography>
            )}
          </Box>
          <DeleteButton
            dataTestId="remove-field"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
          />
        </Box>

        {/* ================== Field Type Rendering ================== */}

        {field.type === "text" && (
          <Controller
            name={field.id}
            control={control}
            defaultValue=""
            render={({ field: rhfField }) => (
              <TextField
                {...rhfField}
                label={field.label || "Untitled"}
                fullWidth
              />
            )}
          />
        )}

        {field.type === "number" && (
          <Controller
            name={field.id}
            control={control}
            defaultValue=""
            render={({ field: rhfField }) => (
              <TextField
                {...rhfField}
                type="number"
                label={field.label || "Untitled"}
                fullWidth
              />
            )}
          />
        )}

        {field.type === "checkbox" && (
          <Box>
            {(field.options || ["Option 1", "Option 2"]).map((opt, index) =>
              optionEditingIndex === index ? (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <TextField
                    data-testid="add-checkbox-text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    onBlur={stopEditingOption}
                    autoFocus
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOption(index);
                    }}
                  />
                </Box>
              ) : (
                <Controller
                  key={index}
                  name={`${field.id}.${opt}`}
                  control={control}
                  defaultValue={false}
                  render={({ field: rhfField }) => (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FormControlLabel
                        data-testid="add-checkbox"
                        control={
                          <Checkbox {...rhfField} checked={rhfField.value} />
                        }
                        label={opt}
                        onDoubleClick={() => startEditingOption(index)}
                        sx={{ flex: 1 }}
                      />
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOption(index);
                        }}
                      />
                    </Box>
                  )}
                />
              )
            )}
            <IconButton data-testid="add-checkbox-option" onClick={addOption}>
              <Add />
            </IconButton>
          </Box>
        )}

        {field.type === "radio" && (
          <Box>
            <Controller
              name={field.id}
              control={control}
              defaultValue=""
              render={({ field: rhfField }) => (
                <RadioGroup {...rhfField}>
                  {(field.options || ["Option 1", "Option 2"]).map(
                    (opt, index) =>
                      optionEditingIndex === index ? (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <TextField
                            data-testid="add-radio-text"
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            onBlur={stopEditingOption}
                            autoFocus
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <DeleteButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOption(index);
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <FormControlLabel
                            data-testid="add-radio"
                            value={opt}
                            control={<Radio />}
                            label={opt}
                            onDoubleClick={() => startEditingOption(index)}
                            sx={{ flex: 1 }}
                          />
                          <DeleteButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOption(index);
                            }}
                          />
                        </Box>
                      )
                  )}
                </RadioGroup>
              )}
            />
            <IconButton data-testid="add-radio-option" onClick={addOption}>
              <Add />
            </IconButton>
          </Box>
        )}

        {field.type === "select" && (
          <Box>
            <Controller
              name={field.id}
              control={control}
              defaultValue=""
              render={({ field: rhfField }) => (
                <TextField
                  select
                  {...rhfField}
                  label={field.label || "Untitled"}
                  fullWidth
                >
                  {(field.options || ["Option 1", "Option 2"]).map(
                    (opt, index) => (
                      <MenuItem key={index} value={opt}>
                        {opt}
                      </MenuItem>
                    )
                  )}
                </TextField>
              )}
            />

            {/* Options Management */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                Options:
              </Typography>
              {(field.options || ["Option 1", "Option 2"]).map((opt, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  {optionEditingIndex === index ? (
                    <TextField
                      data-testid="add-select-text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      onBlur={stopEditingOption}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          stopEditingOption();
                        }
                      }}
                      autoFocus
                      size="small"
                      sx={{ flex: 1, mr: 1 }}
                    />
                  ) : (
                    <Typography
                      data-testid="add-select"
                      variant="body2"
                      sx={{
                        flex: 1,
                        cursor: "pointer",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        mr: 1,
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onDoubleClick={() => startEditingOption(index)}
                    >
                      {opt}
                    </Typography>
                  )}
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOption(index);
                    }}
                  />
                </Box>
              ))}
              <IconButton
                data-testid="add-select-option"
                onClick={addOption}
                size="small"
              >
                <Add />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

FormBuilder.displayName = "FormBuilder";

export default memo(FormBuilder);
