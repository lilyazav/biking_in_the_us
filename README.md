Project in progress. 

- Scaling:
1. Currently using a rough scale transformation between WGS 84 and my SVG. 
2. Do not have any translation after scaling. Need to figure out the math for this.
3. I'm pretty sure the math is all different for Alaska and Hawaii.
4. PR is in my dataset, but not displayed on the map. 

- Issues:
1. You cannot select a state after scaling. Selecting was working fine without the scale transform.
2. App is slow as hell. Plan to refactor once I get the features I want in there. 

- Bike Lanes
1. Once the above is addressed, I really want to put in feature where you can look at bike lanes for selected cities in your chosen state.