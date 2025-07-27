import React from 'react';
import TopCollisionsTable from "./TopCollisionsTable";
import CollisionTypePage from "./CollisionTypePage";
import Histogram from "./collision_type_victims_chart";

export default function CollisionPage() {
  return (
    <div>
      <CollisionTypePage />
      <Histogram />
      <TopCollisionsTable />
    </div>
  );
}
