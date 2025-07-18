# SDG Roulette Wheel

An interactive web application featuring a spinning roulette wheel for the 17 UN Sustainable Development Goals (SDGs).

## Features

- Interactive roulette wheel with 17 segments representing each SDG
- Each segment has the official SDG color and icon
- Pull-down lever mechanism to control spin speed and force
- Realistic spinning animation with physics-based deceleration
- Detailed display of the selected goal after spinning
- Multi-language support (English, Spanish, and Portuguese)
- Mobile-responsive design for all devices

## How to Use

1. Open the application in a web browser
2. Pull down the lever (click and drag down) to set the power level
3. Release the lever to spin the wheel
4. The wheel will spin based on the applied force and eventually stop on one of the SDGs
5. The selected goal's details will be displayed below the wheel

## Technologies Used

- HTML5
- CSS3
- JavaScript (vanilla, no frameworks)

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - CSS styling for the roulette and lever
- `sdg-data.js` - Data for all 17 SDGs including colors and descriptions
- `roulette.js` - JavaScript for the roulette functionality

## About the SDGs

The Sustainable Development Goals (SDGs) are a collection of 17 interlinked global goals designed to be a "blueprint to achieve a better and more sustainable future for all". The SDGs were set up in 2015 by the United Nations General Assembly and are intended to be achieved by the year 2030.

## Deployment

This project is set up to be deployed as a static site on GitHub Pages. To deploy:

1. Push your code to the master branch of your GitHub repository
2. Go to your repository on GitHub
3. Navigate to Settings > Pages
4. Under "Source", select "Deploy from a branch"
5. Select "master" branch and "/ (root)" folder
6. Click "Save"
7. Wait a few minutes for the deployment to complete
8. Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Note on SDG Icons

The application currently uses external URLs for the SDG icons from the UN website. If these URLs stop working:

1. Download the official SDG icons
2. Place them in the `icons` folder
3. Update the paths in `sdg-data.js` to use local icons instead

## License

This project is open source and available under the [MIT License](LICENSE).
