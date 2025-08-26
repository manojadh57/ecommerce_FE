import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

import HeroAds from "../components/HeroAds.jsx";
import SubcategoryRow from "../components/SubcategoryRow.jsx";
import { landingAds } from "../data/landingAds.js";
import "../styles/home.css"; 

export default function Home() {
  // Get all sub-categories from the store and flatten them
  const { subsByParent = {} } = useSelector((s) => s.categories || {});
  const allSubs = useMemo(() => {
    const arrs = Object.values(subsByParent);
    return arrs.flat().map((s) => ({ id: s._id, name: s.name }));
  }, [subsByParent]);

  return (
    <>
      {/* 4-image advertisement slideshow */}
      <HeroAds items={landingAds} height={440} delayMs={3800} />

      {/* Rows 2+: ALL sub-categories with animated product strips */}
      {allSubs.length ? (
        allSubs.map((sc) => (
          <SubcategoryRow key={sc.id} subId={sc.id} title={sc.name} />
        ))
      ) : (
        <Container className="py-3">
          <small className="text-muted">Loading sub-categories…</small>
        </Container>
      )}
    </>
  );
}
