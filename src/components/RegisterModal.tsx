import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, url }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="relative">
                  <iframe
                    src={ url ||`https://form.asana.com/?k=hvUCXQDRKxQ0EBkH1nZ-eg&d=114317148620698&embed=true` }
                    title="Register Form"
                    className="w-full h-[80vh] border-none"
                  />
                  <button
                    className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-xl font-bold"
                    onClick={onClose}
                  >
                    &times;
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RegisterModal;
