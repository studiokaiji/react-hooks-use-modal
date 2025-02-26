import { Options as FocusTrapOptions } from 'focus-trap';
import React, { useCallback, useMemo, useState } from 'react';
import {
  DefaultModal,
  DefaultOverlay,
  DefaultWrapper,
} from './components/DefaultComponents';

import { ModalWrapper } from './components/Modal';
import { useModalConfig } from './hooks/useModalConfig';

export interface WrapperProps {
  children: React.ReactNode;
}

export interface OverlayProps {}

export interface ModalProps<T extends Record<string, unknown>> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  close: () => void;
  children: React.ReactNode;
  additionalProps?: T;
}

export interface UseModalOptions<T extends Record<string, unknown>> {
  initialValue?: boolean;
  preventScroll?: boolean;
  focusTrapOptions?: FocusTrapOptions;
  components?: {
    Wrapper?: React.ComponentType<WrapperProps>;
    Overlay?: React.ComponentType<OverlayProps>;
    Modal?: React.ComponentType<ModalProps<T>>;
  };
}

export interface ModalWrapperProps<T extends Record<string, unknown>> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  additionalProps?: T;
}

export type UseModalResult<T extends Record<string, unknown>> = {
  Modal: React.FC<ModalWrapperProps<T>>;
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

export type UseModal<T extends Record<string, unknown>> = (
  elementId?: string,
  options?: UseModalOptions<T>
) => UseModalResult<T>;

const defaultOptions: Required<UseModalOptions<{}>> = {
  initialValue: false,
  preventScroll: false,
  focusTrapOptions: {},
  components: {},
};

export const useModal = <T extends Record<string, unknown>>(
  elementId = 'root',
  options?: UseModalOptions<T>
): UseModalResult<T> => {
  const modalConfig = useModalConfig<T>();
  const { initialValue, preventScroll, focusTrapOptions, components } = useMemo(
    () => Object.assign({}, defaultOptions, modalConfig, options),
    [modalConfig, options]
  );
  const [isOpen, setOpen] = useState<boolean>(initialValue);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  const Wrapper = components.Wrapper ?? DefaultWrapper;
  const Overlay = components.Overlay ?? DefaultOverlay;
  const Modal = components.Modal ?? DefaultModal;

  const _ModalWrapper: React.FC<ModalWrapperProps<T>> = useCallback(
    ({ title, description, children, additionalProps }) => {
      return (
        <ModalWrapper
          isOpen={isOpen}
          close={close}
          elementId={elementId}
          title={title}
          description={description}
          preventScroll={preventScroll}
          focusTrapOptions={focusTrapOptions}
          components={{
            Modal,
            Overlay,
            Wrapper,
          }}
          additionalProps={additionalProps}
        >
          {children}
        </ModalWrapper>
      );
    },
    [
      Modal,
      Overlay,
      Wrapper,
      close,
      elementId,
      focusTrapOptions,
      isOpen,
      preventScroll,
    ]
  );

  return {
    Modal: _ModalWrapper,
    open,
    close,
    isOpen,
  };
};

export { ModalProvider } from './components/ModalProvider';
