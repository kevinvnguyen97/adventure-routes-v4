import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";
import { MINIMUM_USERNAME_LENGTH } from "/imports/constants";

type ChangeUsernameModalProps = {
  newUsername: string;
  setNewUsername: (newUsername: string) => void;
  applyUsernameChange: () => void;
};
export const ChangeUsernameModal = (props: ChangeUsernameModalProps) => {
  const { newUsername, setNewUsername, applyUsernameChange } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isFormValid = [!!newUsername].every((criteria) => !!criteria);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      applyUsernameChange();
      setNewUsername("");
      onClose();
    }
  };

  return (
    <Box>
      <IconButton
        colorScheme="orange"
        icon={<EditIcon />}
        aria-label="username-edit"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="orange" textColor="white">
          <ModalHeader>Change Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleFormSubmit}
              id="change-username-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <FormControl
                isRequired
                isInvalid={
                  !newUsername || newUsername.length < MINIMUM_USERNAME_LENGTH
                }
              >
                <Input
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  backgroundColor="white"
                  textColor="black"
                  focusBorderColor="orange.400"
                  errorBorderColor="red.500"
                  required
                />
                <FormErrorMessage>
                  {!newUsername
                    ? "Username required"
                    : `Username must be at least ${MINIMUM_USERNAME_LENGTH} characters long`}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter display="flex" gap={2}>
            <Button
              colorScheme="blue"
              type="submit"
              form="change-username-form"
              disabled={!isFormValid}
            >
              Apply Changes
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
