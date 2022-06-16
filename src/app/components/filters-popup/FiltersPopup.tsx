import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMedia } from 'react-use';

import FilterIcon from '../../../assets/images/marketplace/filters2.svg';
import CloseIcon from '../../../assets/images/close-menu.svg';

// import { breakpoints } from '../../theme/constants';
import { ClearAllButton } from '../filters';
import * as styles from './FiltersPopup.styles';

export interface IChildrenFnProps {
  openMobileFilters: () => void;
}

export interface IFiltersPopupProps {
  mobileFilters: Array<{
    name: string;
    form: FormikProps<any>;
    icon: string;
    visible?: boolean;
    renderFilter: (props: { value: any, onChange: (value: any) => void }) => React.ReactNode;
  }>;
  children: (props: IChildrenFnProps) => React.ReactNode;
}

export const FiltersPopup = (props: IFiltersPopupProps) => {
  const {
    mobileFilters,
    children,
  } = props;

  const isMobile = useMedia(`(max-width: ${breakpoints.md})`);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [values, setValues] = useState<Record<number, any>>();

  const handleClearAll = useCallback(() => {
    for (const filter of mobileFilters) {
      filter.form.resetForm();
    }
    onClose();
  }, [mobileFilters]);

  const handleSetValue = useCallback((i: number, newValue: any) => {
    setValues((values) => ({ ...values, [i]: newValue }));
  }, []);

  const handleSave = useCallback(() => {
    if (values) {
      mobileFilters.forEach(({ form }, i) => form.setValues(values[i]));
      onClose();
    }
  }, [values]);

  const handleToggleAccordionItem = useCallback((e) => {
    if (!isMobile) {
      e.preventDefault();
    }
  }, [isMobile]);

  const openedTabs = useMemo(() => {
    return mobileFilters.map((_, i) => i);
  }, []);

  useEffect(() => {
    isOpen
      ? setValues((mobileFilters || []).reduce<Record<number, any>>((acc, filter, i) => {
        acc[i] = filter.form.values;
        return acc;
      }, {}))
      : setValues(undefined)
  }, [isOpen, mobileFilters]);

  const countDirtyFilters = mobileFilters.reduce((acc, { form }) => form.dirty ? acc += 1 : acc, 0);

  return (
    <>
      {!isMobile ? children({
        openMobileFilters: onOpen,
      }) : null}

      <Button
        {...styles.MobileFilterButton}
        display={{ base: 'inline-flex', md: 'none' }}
        onClick={onOpen}
      >
        <Box {...styles.ActiveFilterLabel} display={!!countDirtyFilters ? 'flex' : 'none'}>
          {countDirtyFilters}
        </Box>
        <img src={FilterIcon} alt="Filter" />
      </Button>

      <Modal isOpen={isOpen} size={isMobile ? 'full' : 'md'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={isMobile ? 0 : 'md'}>
          {!isMobile && (<ModalCloseButton />)}
          <ModalHeader {...styles.ModalHeader}>
            Filters
            <Box {...styles.ModalHeaderMobileClose}>
              <ClearAllButton onClick={() => handleClearAll()} />
              <Button variant={'simpleOutline'} borderColor={'transparent'} ml={'20px'} onClick={onClose}>
                <Image src={CloseIcon} />
              </Button>
            </Box>
          </ModalHeader>
          <ModalBody {...styles.ModalBody}>
            {values && (
              <Accordion allowMultiple defaultIndex={openedTabs}>
                {mobileFilters.map(({ renderFilter, visible = true, ...filter }, i) => !visible ? null :(
                  <AccordionItem key={i} {...styles.AccordionItem}>
                    <AccordionButton {...styles.AccordionButton} onClick={handleToggleAccordionItem}>
                      <Box flex='1' textAlign='left'>
                        <Image src={filter.icon} {...styles.AccordionButtonImage} />
                        {filter.name}
                      </Box>
                      <AccordionIcon display={{ base: 'inline-block', md: 'none' }} />
                    </AccordionButton>
                    <AccordionPanel p={'0 0 30px 0'}>
                      {renderFilter({
                        value: values[i],
                        onChange: (value: any) => handleSetValue(i, value)
                      })}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </ModalBody>

          <ModalFooter {...styles.ModalFooter} borderBottomRadius={{ base: 0, md: 'md' }}>
            <Box display={{ base: 'none', md: 'flex' }} justifyContent={'space-between'} w={'100%'} alignItems={'center'}>
              <ClearAllButton onClick={handleClearAll} />
              <Button onClick={handleSave}>Save</Button>
            </Box>
            <Box display={{ base: 'block', md: 'none' }} w={'100%'}>
              <Button isFullWidth={true} onClick={handleSave}>Show results</Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
