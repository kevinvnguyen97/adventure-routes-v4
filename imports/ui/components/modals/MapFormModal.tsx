import React, { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useToast,
  FormControl,
  FormErrorMessage,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";
import { useMeteorAuth } from "../../providers/Auth";
import { Meteor } from "meteor/meteor";
import { CreatableSelect as MultiSelect, Options } from "chakra-react-select";
import { AdventureRoute } from "/imports/api/adventureRoutes";
import { meteorMethodPromise } from "/imports/utils";
import { TOAST_PRESET } from "/imports/constants/toast";
import { Color } from "/imports/constants";

const DEFAULT_ACTIVITY_OPTIONS: Options<{ label: string; value: string }> = [
  { label: "Music", value: "Music" },
  { label: "Food/Drink", value: "Food/Drink" },
  { label: "Sports", value: "Sports" },
  { label: "Comedy", value: "Comedy" },
  { label: "Movies", value: "Movies" },
];

type MapFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  adventureRoute?: AdventureRoute;
};
export const MapFormModal = (props: MapFormModalProps) => {
  const { isOpen, onClose, adventureRoute } = props;
  const toast = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceCategory, setPriceCategory] = useState(0);
  const [activities, setActivities] = useState<string[]>([]);
  const [activityOptions, setActivityOptions] = useState(
    DEFAULT_ACTIVITY_OPTIONS
  );
  const [origin, setOrigin] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([""]);
  const [destination, setDestination] = useState("");

  const isEditing = !!adventureRoute;

  const formattedActivities: Options<{ label: string; value: string }> =
    activities.map((activity) => ({
      label: activity,
      value: activity,
    }));

  useEffect(() => {
    if (isEditing) {
      const {
        name,
        priceCategory = 0,
        description = "",
        route,
        activities = [],
      } = adventureRoute;
      const { origin, waypoints = [""], destination } = route;
      setName(name);
      setPriceCategory(priceCategory);
      setActivities(activities.length > 0 ? activities : []);
      setDescription(description);
      setOrigin(origin);
      setWaypoints(waypoints.length > 0 ? waypoints : [""]);
      setDestination(destination);
    }
  }, [isEditing]);

  const { userId } = useMeteorAuth();

  const submitMapForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      const adventureRouteInput: AdventureRoute = {
        _id: isEditing ? adventureRoute._id : undefined,
        userId,
        name,
        priceCategory,
        activities,
        description,
        route: {
          origin,
          waypoints: waypoints.filter((waypoint) => !!waypoint),
          destination,
        },
      };

      try {
        await meteorMethodPromise("upsertAdventureRoute", adventureRouteInput);
        toast({
          ...TOAST_PRESET,
          title: "Success",
          description: `${
            isEditing
              ? `Successfully saved changes for route ${name}`
              : `Created route ${name}`
          }`,
          status: "success",
        });
        onClose();
      } catch (error) {
        if (error) {
          const meteorError = error as Meteor.Error;
          console.error(meteorError);
          toast({
            ...TOAST_PRESET,
            title: meteorError.name,
            description: meteorError.message,
            status: "error",
          });
        }
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor={Color.ORANGE} textColor={Color.WHITE}>
        <ModalHeader>{isEditing ? "Edit" : "Create"} Route</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={submitMapForm}
            id="map-form"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <FormControl isRequired isInvalid={!name}>
              <Input
                placeholder="Route Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                backgroundColor={Color.WHITE}
                textColor={Color.BLACK}
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
                required
              />
              <FormErrorMessage>Route name is required</FormErrorMessage>
            </FormControl>
            <FormControl>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                bgColor={Color.WHITE}
                textColor={Color.BLACK}
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
                as="textarea"
              />
            </FormControl>
            <Select
              placeholder="Select Price Category"
              value={priceCategory}
              onChange={(e) => setPriceCategory(parseInt(e.target.value))}
              bgColor={Color.WHITE}
              textColor={Color.BLACK}
              focusBorderColor="orange.400"
              errorBorderColor="red.500"
            >
              <option value={0}>Free</option>
              <option value={1}>$</option>
              <option value={2}>$$</option>
              <option value={3}>$$$</option>
            </Select>
            <FormControl>
              <MultiSelect
                colorScheme="orange"
                options={activityOptions}
                placeholder="Select or create activities"
                tagVariant="solid"
                onCreateOption={(newValue) => {
                  setActivityOptions([
                    ...activityOptions,
                    { label: newValue, value: newValue },
                  ]);
                  setActivities([...activities, newValue]);
                }}
                value={formattedActivities}
                onChange={(newValue) =>
                  setActivities(newValue.map((activity) => activity.value))
                }
                noOptionsMessage={() => "Type to create an activity"}
                selectedOptionStyle="check"
                chakraStyles={{
                  container: (style) => ({
                    ...style,
                    bgColor: Color.WHITE,
                    borderRadius: 7,
                  }),
                  dropdownIndicator: (style) => ({
                    ...style,
                    bgColor: Color.DARK_ORANGE,
                  }),
                  option: (style) => ({
                    ...style,
                    bgColor: Color.ORANGE,
                    _hover: { bgColor: Color.DARK_ORANGE },
                  }),
                  menuList: (style) => ({
                    ...style,
                    bgColor: Color.ORANGE,
                    borderColor: Color.DARK_ORANGE,
                  }),
                  menu: (style) => ({
                    ...style,
                    boxShadow: `inset 0 -3em 3em rgb(0 200 0 / 30%),
                  0.3em 0.3em 1em rgb(200 0 0 / 60%)`,
                    borderRadius: 7,
                  }),
                  noOptionsMessage: (style) => ({
                    ...style,
                    textColor: Color.WHITE,
                  }),
                  input: (style) => ({ ...style, textColor: Color.BLACK }),
                  crossIcon: (style) => ({
                    ...style,
                    color: Color.RED,
                  }),
                }}
                isMulti
              />
            </FormControl>
            <FormControl isRequired isInvalid={!origin}>
              <Input
                placeholder="Origin"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                }}
                backgroundColor={Color.WHITE}
                textColor={Color.BLACK}
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
              />
              <FormErrorMessage>Origin is required</FormErrorMessage>
            </FormControl>
            {waypoints.map((waypoint, i) => {
              return (
                <InputGroup key={`waypoint${i}`}>
                  <Input
                    placeholder={`Waypoint ${i + 1}`}
                    value={waypoint}
                    onChange={(e) => {
                      const updatedWaypoints = waypoints.map(
                        (existingWaypoint, waypointIndexToUpdate) =>
                          i === waypointIndexToUpdate
                            ? e.target.value
                            : existingWaypoint
                      );
                      setWaypoints(updatedWaypoints);
                    }}
                    backgroundColor={Color.WHITE}
                    textColor={Color.BLACK}
                    focusBorderColor="orange.400"
                    errorBorderColor="red.500"
                  />
                  {waypoints.length > 1 && (
                    <Button
                      onClick={() => {
                        const updatedWaypoints = waypoints.filter(
                          (_, waypointIndexToRemove) =>
                            i !== waypointIndexToRemove
                        );
                        setWaypoints(updatedWaypoints);
                      }}
                      colorScheme="red"
                    >
                      -
                    </Button>
                  )}
                  {waypoints.length < 25 && (
                    <Button
                      onClick={() => setWaypoints([...waypoints, ""])}
                      colorScheme="orange"
                    >
                      +
                    </Button>
                  )}
                </InputGroup>
              );
            })}
            <FormControl isRequired isInvalid={!destination}>
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                backgroundColor={Color.WHITE}
                textColor={Color.BLACK}
                focusBorderColor="orange.400"
                errorBorderColor="red.500"
              />
              <FormErrorMessage>Destination is required</FormErrorMessage>
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="orange" mr={3} type="submit" form="map-form">
            {isEditing ? "Save Changes" : "Create Adventure Route"}
          </Button>
          <Button onClick={onClose} colorScheme="red">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
