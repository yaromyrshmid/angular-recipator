import { Component, OnInit } from "@angular/core";

import { Recipe } from "../recipe.model";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      "Olivie",
      "Good olivieshechka",
      "https://live.staticflickr.com/65535/48130513301_9675d15919_b.jpg"
    ),
    new Recipe(
      "Olivie2",
      "Good olivieshechka2",
      "https://live.staticflickr.com/65535/48130513301_9675d15919_b.jpg"
    )
  ];

  constructor() {}

  ngOnInit() {}
}
