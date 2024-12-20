/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getBlog, listPosts } from "../graphql/queries";
import { updateBlog, updatePost } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function BlogUpdateForm(props) {
  const {
    id: idProp,
    blog: blogModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    costPrice: "",
    sellingPrice: "",
    posts: [],
  };
  const [name, setName] = React.useState(initialValues.name);
  const [costPrice, setCostPrice] = React.useState(initialValues.costPrice);
  const [sellingPrice, setSellingPrice] = React.useState(
    initialValues.sellingPrice
  );
  const [posts, setPosts] = React.useState(initialValues.posts);
  const [postsLoading, setPostsLoading] = React.useState(false);
  const [postsRecords, setPostsRecords] = React.useState([]);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = blogRecord
      ? { ...initialValues, ...blogRecord, posts: linkedPosts }
      : initialValues;
    setName(cleanValues.name);
    setCostPrice(cleanValues.costPrice);
    setSellingPrice(cleanValues.sellingPrice);
    setPosts(cleanValues.posts ?? []);
    setCurrentPostsValue(undefined);
    setCurrentPostsDisplayValue("");
    setErrors({});
  };
  const [blogRecord, setBlogRecord] = React.useState(blogModelProp);
  const [linkedPosts, setLinkedPosts] = React.useState([]);
  const canUnlinkPosts = true;
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getBlog.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getBlog
        : blogModelProp;
      const linkedPosts = record?.posts?.items ?? [];
      setLinkedPosts(linkedPosts);
      setBlogRecord(record);
    };
    queryData();
  }, [idProp, blogModelProp]);
  React.useEffect(resetStateValues, [blogRecord, linkedPosts]);
  const [currentPostsDisplayValue, setCurrentPostsDisplayValue] =
    React.useState("");
  const [currentPostsValue, setCurrentPostsValue] = React.useState(undefined);
  const postsRef = React.createRef();
  const getIDValue = {
    posts: (r) => JSON.stringify({ id: r?.id }),
  };
  const postsIdSet = new Set(
    Array.isArray(posts)
      ? posts.map((r) => getIDValue.posts?.(r))
      : getIDValue.posts?.(posts)
  );
  const getDisplayValue = {
    posts: (r) => `${r?.title ? r?.title + " - " : ""}${r?.id}`,
  };
  const validations = {
    name: [{ type: "Required" }],
    costPrice: [],
    sellingPrice: [],
    posts: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const fetchPostsRecords = async (value) => {
    setPostsLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ title: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listPosts.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listPosts?.items;
      var loaded = result.filter(
        (item) => !postsIdSet.has(getIDValue.posts?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setPostsRecords(newOptions.slice(0, autocompleteLength));
    setPostsLoading(false);
  };
  React.useEffect(() => {
    fetchPostsRecords("");
  }, []);
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          costPrice: costPrice ?? null,
          sellingPrice: sellingPrice ?? null,
          posts: posts ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(
                    fieldName,
                    item,
                    getDisplayValue[fieldName]
                  )
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(
                fieldName,
                modelFields[fieldName],
                getDisplayValue[fieldName]
              )
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          const promises = [];
          const postsToLink = [];
          const postsToUnLink = [];
          const postsSet = new Set();
          const linkedPostsSet = new Set();
          posts.forEach((r) => postsSet.add(getIDValue.posts?.(r)));
          linkedPosts.forEach((r) => linkedPostsSet.add(getIDValue.posts?.(r)));
          linkedPosts.forEach((r) => {
            if (!postsSet.has(getIDValue.posts?.(r))) {
              postsToUnLink.push(r);
            }
          });
          posts.forEach((r) => {
            if (!linkedPostsSet.has(getIDValue.posts?.(r))) {
              postsToLink.push(r);
            }
          });
          postsToUnLink.forEach((original) => {
            if (!canUnlinkPosts) {
              throw Error(
                `Post ${original.id} cannot be unlinked from Blog because blogPostsId is a required field.`
              );
            }
            promises.push(
              client.graphql({
                query: updatePost.replaceAll("__typename", ""),
                variables: {
                  input: {
                    id: original.id,
                    blogPostsId: null,
                  },
                },
              })
            );
          });
          postsToLink.forEach((original) => {
            promises.push(
              client.graphql({
                query: updatePost.replaceAll("__typename", ""),
                variables: {
                  input: {
                    id: original.id,
                    blogPostsId: blogRecord.id,
                  },
                },
              })
            );
          });
          const modelFieldsToSave = {
            name: modelFields.name,
            costPrice: modelFields.costPrice ?? null,
            sellingPrice: modelFields.sellingPrice ?? null,
          };
          promises.push(
            client.graphql({
              query: updateBlog.replaceAll("__typename", ""),
              variables: {
                input: {
                  id: blogRecord.id,
                  ...modelFieldsToSave,
                },
              },
            })
          );
          await Promise.all(promises);
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "BlogUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              costPrice,
              sellingPrice,
              posts,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Cost price"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={costPrice}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              costPrice: value,
              sellingPrice,
              posts,
            };
            const result = onChange(modelFields);
            value = result?.costPrice ?? value;
          }
          if (errors.costPrice?.hasError) {
            runValidationTasks("costPrice", value);
          }
          setCostPrice(value);
        }}
        onBlur={() => runValidationTasks("costPrice", costPrice)}
        errorMessage={errors.costPrice?.errorMessage}
        hasError={errors.costPrice?.hasError}
        {...getOverrideProps(overrides, "costPrice")}
      ></TextField>
      <TextField
        label="Selling price"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={sellingPrice}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              costPrice,
              sellingPrice: value,
              posts,
            };
            const result = onChange(modelFields);
            value = result?.sellingPrice ?? value;
          }
          if (errors.sellingPrice?.hasError) {
            runValidationTasks("sellingPrice", value);
          }
          setSellingPrice(value);
        }}
        onBlur={() => runValidationTasks("sellingPrice", sellingPrice)}
        errorMessage={errors.sellingPrice?.errorMessage}
        hasError={errors.sellingPrice?.hasError}
        {...getOverrideProps(overrides, "sellingPrice")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              costPrice,
              sellingPrice,
              posts: values,
            };
            const result = onChange(modelFields);
            values = result?.posts ?? values;
          }
          setPosts(values);
          setCurrentPostsValue(undefined);
          setCurrentPostsDisplayValue("");
        }}
        currentFieldValue={currentPostsValue}
        label={"Posts"}
        items={posts}
        hasError={errors?.posts?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("posts", currentPostsValue)
        }
        errorMessage={errors?.posts?.errorMessage}
        getBadgeText={getDisplayValue.posts}
        setFieldValue={(model) => {
          setCurrentPostsDisplayValue(
            model ? getDisplayValue.posts(model) : ""
          );
          setCurrentPostsValue(model);
        }}
        inputFieldRef={postsRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Posts"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Post"
          value={currentPostsDisplayValue}
          options={postsRecords.map((r) => ({
            id: getIDValue.posts?.(r),
            label: getDisplayValue.posts?.(r),
          }))}
          isLoading={postsLoading}
          onSelect={({ id, label }) => {
            setCurrentPostsValue(
              postsRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentPostsDisplayValue(label);
            runValidationTasks("posts", label);
          }}
          onClear={() => {
            setCurrentPostsDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchPostsRecords(value);
            if (errors.posts?.hasError) {
              runValidationTasks("posts", value);
            }
            setCurrentPostsDisplayValue(value);
            setCurrentPostsValue(undefined);
          }}
          onBlur={() => runValidationTasks("posts", currentPostsDisplayValue)}
          errorMessage={errors.posts?.errorMessage}
          hasError={errors.posts?.hasError}
          ref={postsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "posts")}
        ></Autocomplete>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || blogModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || blogModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
