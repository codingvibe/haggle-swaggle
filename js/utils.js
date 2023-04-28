export function getResizeProportions(width, height, minNum) {
  if (width > height) {
    return {
      height: Math.max(height, minNum),
      width: Math.max(width, minNum/height * width)
    }
  } else {
    return {
      width: Math.max(width, minNum),
      height: Math.max(height, minNum/width * height)
    }
  }
}

export function setButtonEnabled(container, enabled) {
  const tint = enabled ? 0xFFFFFF : 0x222222;
  const eventMode = enabled ? "static": "none" 
  container.eventMode = eventMode;
  container.children.forEach(child => {
    if (child.children && child.children.length > 0) {
      child.children.forEach(innerChild => innerChild.tint = tint);
    } else {
      child.tint = tint
    }
  });
}