import { useLayoutEffect, useState, useEffect } from "react";
import { createPortal } from "react-dom";

function MenuPortal({
  anchorRef,
  isOpen,
  width = 170,
  children,
  onClose
}) {

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const [position, setPosition] = useState({
    top: 0,
    left: 0
  });

  useLayoutEffect(() => {

    if (!isOpen || !anchorRef.current) {
      return;
    }

    const updatePosition = () => {

      const rect =
        anchorRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 8,
        left: rect.right - width
      });

    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {

      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );

    };

  }, [
    isOpen,
    anchorRef,
    width
  ]);

  if (!isOpen) {
    return null;
  }

  return createPortal(

    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width,
        zIndex: 10000
      }}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>,

    document.body

  );

}

export default MenuPortal;