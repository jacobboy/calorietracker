# current
# algolia

# copy recipe
# total description has NaN g in it when making ice cream base 
# make ingredient rows show macros for amount
# reset search form and cursor location after adding ingredient
# deploy script
# what's going on with the tests
# add date to ingredient and recipe tables
# fix links for ingredients and recipes
# can't submit ingredient with unfilled out forms
- formik?
# Recipe notes
# ingredient notes, starred, default portions, and portion aliases
# make 1g portions
# link households
# handle ingredient portions
# handle ingredient different units
## https://fdc.nal.usda.gov/fdc-app.html#/food-details/2086725/nutrients has ml
## https://fdc.nal.usda.gov/fdc-app.html#/food-details/748278/nutrients might have ml?
# foods where default isn't 100g?
# branded foods '"Calculated from value per serving size measure"'
# https://mui.com/getting-started/usage/ Responsive meta tag
- <meta name="viewport" content="initial-scale=1, width=device-width" />
# ingredient vs recipe in ingredient search
# make sure i'm not saving cruft when i add a recipe to a recipe
## can slim down some of these objects too
# handle undefined in recipe
# edit/delete recipe, ingredient
- edit implies not storing macros with recipes
- delete implies searching for recipes that use it and deleting those?
- maybe just "deprecate" ingredients to exclude them from search?
# improve search
## search pagination
# firestore permissions issues
why doesn't this work anymore?
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.creator;
    }
  }
}
```
## clues
- started just after adding algolia.  what does algolia do?
- trying it in rules playground tells me that resource is null, but this is taked from the docs
- errors, but not denies, in firestore > rules > monitor rules. what are they?
