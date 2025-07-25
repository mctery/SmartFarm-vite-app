# SmartFarm-vite-app
SmartFarm-webapp

This project includes several pages such as Login, Register, Dashboard, About,
a **Help** page for quick user guidance and the **Farm Control System** page for
managing user devices. On the Farm Control System page you can add, edit or
remove devices. Each device card shows basic information and includes buttons to
update or delete the device. A dialog form is provided for creating a new
device while editing opens a sidebar panel for quick modifications. Device
widgets display status chips and demonstrate realtime updates via a WebSocket
helper function.

## Project Structure

```
src/
  assets/        # Static images and other assets
  components/    # Reusable UI components
  layouts/       # Layout components used across pages
  pages/         # Application pages
    auth/        # Authentication pages
    farm/        # Farm management pages
  services/      # API calls and utility functions
  styles/        # Global stylesheets
  App.jsx        # Root application component
  main.jsx       # Entry point
```

This structure groups related functionality together and keeps the codebase organized for easier maintenance.
