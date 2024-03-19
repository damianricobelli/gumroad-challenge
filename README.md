## Project Overview

This repository contains an app developed with React and TypeScript, featuring an original idea implemented using various technologies including accessible Radix UI components, Tailwind CSS, and Radix Colors for accessible color schemes.

## App Description

The app allows users to interact with a list of images, enabling them to draw boxes on selected images. These boxes function similarly to those in design tools like Figma, allowing users to move, delete, and resize them. Notably, the app calculates precise location coordinates (top, left, width, height) on the image, accounting for factors like image zoom or browser window resizing.

The primary objective is for users to classify elements within the images by creating and labeling boxes. Once completed, the app stores information about each box, including its exact coordinates and classification.

### Potential Use Cases
With a backend implementation, the collected data opens up various potential applications. For instance, it could be used to train AI models to recognize and classify objects within images. Although initially considered for integration with the AWS Rekognition API, concerns about processing delays led to a decision to maintain a static approach.

### Active Functionalities
- [x] Selecting and changing the listing image.
- [x] Drawing boxes
- [x] Resizing boxes
- [x] Deleting boxes
- [x] Right-click functionality on boxes to duplicate or delete them.
- [x] Display of exact scaled coordinates of boxes relative to the image's actual size.
- [x] Image zoom controls
- [x] Reset image to initial state (useful for images with pre-existing coordinates)
- [x] Deleting all boxes
- [x] Downloading images in .jpg, .png, and .svg formats along with drawn boxes.
- [x] Random image addition via the API of picsum.photos

### Inactive Functionalities
- [ ] Edit image list button: Removed due to lack of backend; images can be simulated for deletion by removing them from the static list.
- [ ] Save changes button: Deactivated as there is no backend storage; modifications are not stored or uploaded.

## How to run the app

1. Clone the repository to your local machine.
2. Run `pnpm i` to install the necessary dependencies.
3. Run `pnpm dev` to start the development server.
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Feel free to explore the app and its functionalities!