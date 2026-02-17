---
type: prompt
category: system
applies_to: all
---

# System: General Coding Style Guide

## Code Quality Standards
All code generated must adhere to these principles:

### Structure & Organization
- Write clean, readable code with clear intent
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for classes)
- Keep functions concise and focused (single responsibility principle)
- Add meaningful comments for complex logic or non-obvious intent
- Organize imports at top of file
- Avoid dead code and unused variables

### Indentation & Formatting
- Use 2-space indentation consistently
- Add blank lines between logical sections
- Keep lines under 100 characters where practical
- Align similar code elements for readability

### Accessibility & Semantic HTML
- Prioritize semantic HTML structure (no div soup)
- Include `alt` attributes for all images
- Add ARIA labels for interactive elements
- Ensure keyboard navigation support
- Test for WCAG 2.1 AA compliance

### Performance Optimization
- Minimize expensive operations in loops
- Cache DOM queries when used multiple times
- Use efficient data structures (Set for lookups, Map for key-value pairs)
- Avoid memory leaks and unused references
- Lazy load content when appropriate

### Error Handling
- Handle errors gracefully without silent failures
- Provide meaningful error messages
- Log errors appropriately for debugging
- Never let errors crash the entire application

### Documentation
- Add JSDoc comments for functions
- Document complex algorithms with inline comments
- Keep README up to date
- Include examples for public interfaces

## Browser Compatibility
- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Use CSS features with graceful degradation
- Test resizing and zoom functionality
- Verify on both desktop and mobile viewports

## Security Considerations
- Sanitize user input (especially in HTML context)
- Don't embed sensitive data in client-side code
- Use HTTPS for all external resources
- Validate data before processing

## Example: Good Code Structure
```javascript
/**
 * Processes player movement input
 * @param {string} direction - Direction ('up', 'down', 'left', 'right')
 * @returns {boolean} - True if movement was valid
 */
function handlePlayerMovement(direction) {
  const VALID_DIRECTIONS = ['up', 'down', 'left', 'right'];
  
  if (!VALID_DIRECTIONS.includes(direction)) {
    console.error(`Invalid direction: ${direction}`);
    return false;
  }
  
  const nextPos = calculateNextPosition(direction);
  
  if (isValidMove(nextPos)) {
    updatePlayerPosition(nextPos);
    return true;
  }
  
  return false;
}
```

## Performance Targets
- Page load time: < 2 seconds
- Game frame rate: 60 FPS
- First contentful paint: < 1 second
- Interaction response: < 100ms
