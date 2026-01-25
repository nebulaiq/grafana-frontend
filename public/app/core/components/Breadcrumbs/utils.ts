import { NavModelItem } from '@grafana/data';

import { Breadcrumb } from './types';

/**
 * Build simplified breadcrumbs: Home > Current page only
 * This is the NebulaIQ style - minimal, clean navigation
 */
export function buildSimpleBreadcrumbs(
  sectionNav: NavModelItem,
  pageNav?: NavModelItem,
  homeNav?: NavModelItem
): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [];

  // Always add Home as the first breadcrumb
  if (homeNav) {
    crumbs.push({ text: 'Home', href: homeNav.url ?? '/' });
  }

  // Get the current page title - prefer pageNav, fallback to sectionNav
  const currentPage = pageNav || sectionNav;
  if (currentPage && currentPage.text) {
    // Don't duplicate if current page is Home
    if (homeNav && currentPage.url === homeNav.url) {
      return crumbs;
    }
    crumbs.push({ text: currentPage.text, href: currentPage.url ?? '' });
  }

  return crumbs;
}

export function buildBreadcrumbs(
  sectionNav: NavModelItem,
  pageNav?: NavModelItem,
  homeNav?: NavModelItem,
  skipHome?: boolean
) {
  const crumbs: Breadcrumb[] = [];
  let foundHome = false;
  let lastPath: string | undefined = undefined;

  function addCrumbs(node: NavModelItem, shouldDedupe = false) {
    if (foundHome) {
      return;
    }

    // construct the URL to match
    const urlParts = node.url?.split('?') ?? ['', ''];
    let urlToMatch = urlParts[0];
    const urlSearchParams = new URLSearchParams(urlParts[1]);
    if (urlSearchParams.has('editview')) {
      urlToMatch += `?editview=${urlSearchParams.get('editview')}`;
    }

    // Check if we found home/root if if so return early
    if (homeNav && urlToMatch === homeNav.url) {
      if (!skipHome) {
        crumbs.unshift({ text: homeNav.text, href: node.url ?? '' });
      }
      foundHome = true;
      return;
    }

    const isSamePathAsLastBreadcrumb = urlToMatch.length > 0 && lastPath === urlToMatch;

    // Remember this path for the next breadcrumb
    lastPath = urlToMatch;

    const shouldAddCrumb = !node.hideFromBreadcrumbs && !(shouldDedupe && isSamePathAsLastBreadcrumb);

    if (shouldAddCrumb) {
      const activeChildIndex = node.children?.findIndex((child) => child.active) ?? -1;
      // Add tab to breadcrumbs if it's not the first active child
      if (activeChildIndex > 0) {
        const activeChild = node.children?.[activeChildIndex];
        if (activeChild) {
          crumbs.unshift({ text: activeChild.text, href: activeChild.url ?? '' });
        }
      }
      crumbs.unshift({ text: node.text, href: node.url ?? '' });
    }

    if (node.parentItem) {
      addCrumbs(node.parentItem);
    }
  }

  if (pageNav) {
    addCrumbs(pageNav);
  }

  // shouldDedupe = true enables app plugins to control breadcrumbs of their root pages
  addCrumbs(sectionNav, true);

  return crumbs;
}
