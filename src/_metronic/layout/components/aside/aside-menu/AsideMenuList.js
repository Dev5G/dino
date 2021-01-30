/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { EssentialsMenu, ProductsMenu/*, ElementsMenu*/ } from "./menu";

export function AsideMenuList({ layoutProps }) {
	const location = useLocation();
	const getMenuItemActive = (url, hasSubmenu = false) => {
		return checkIsActive(location, url)
			? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
			: "";
	};

	return (
		<>
			{/* begin::Menu Nav */}
			<ul className={`menu-nav ${layoutProps.ulClasses}`}>
				{/*begin::1 Level*/}
				<li
					className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
					aria-haspopup="true"
				>
					<NavLink className="menu-link" to="/dashboard">
						<span className="svg-icon menu-icon">
							<SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
						</span>
						<span className="menu-text">Dashboard</span>
					</NavLink>
				</li>
				{/*end::1 Level*/}
				{/* Manage */}
				{/* begin::section */}
				<li className="menu-section ">
					<h4 className="menu-text">Manage</h4>
					<i className="menu-icon flaticon-more-v2"></i>
				</li>
				{/* end:: section */}
				{/* Manage -- Farm settings */}
				<EssentialsMenu
					getMenuItemActive={getMenuItemActive} />

				<ProductsMenu
					getMenuItemActive={getMenuItemActive} />

				{/*<ElementsMenu
					getMenuItemActive={getMenuItemActive} />*/}

					{/** 
				<li className="menu-section ">
					<h4 className="menu-text">Application</h4>
					<i className="menu-icon flaticon-more-v2"></i>
				</li>
			
				<li
					className={`menu-item menu-item-submenu ${getMenuItemActive(
						"/e-commerce", true
					)}`}
					aria-haspopup="true"
					data-menu-toggle="hover"
				>
					<NavLink className="menu-link menu-toggle" to="/e-commerce">
						<span className="svg-icon menu-icon">
							<SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
						</span>
						<span className="menu-text">eCommerce</span>
					</NavLink>
					<div className="menu-submenu">
						<i className="menu-arrow" />
						<ul className="menu-subnav">
							<li className="menu-item menu-item-parent" aria-haspopup="true">
								<span className="menu-link">
									<span className="menu-text">eCommerce</span>
								</span>
							</li>
							
							<li
								className={`menu-item ${getMenuItemActive(
									"/e-commerce/customers"
								)}`}
								aria-haspopup="true"
							>
								<NavLink className="menu-link" to="/e-commerce/customers">
									<i className="menu-bullet menu-bullet-dot">
										<span />
									</i>
									<span className="menu-text">Customers</span>
								</NavLink>
							</li>

							<li
								className={`menu-item ${getMenuItemActive(
									"/e-commerce/salesmen"
								)}`}
								aria-haspopup="true"
							>
								<NavLink className="menu-link" to="/e-commerce/salesmen">
									<i className="menu-bullet menu-bullet-dot">
										<span />
									</i>
									<span className="menu-text">Salesmen</span>
								</NavLink>
							</li>

							<li
								className={`menu-item ${getMenuItemActive(
									"/e-commerce/sales"
								)}`}
								aria-haspopup="true"
							>
								<NavLink className="menu-link" to="/e-commerce/sales">
									<i className="menu-bullet menu-bullet-dot">
										<span />
									</i>
									<span className="menu-text">Sales</span>
								</NavLink>
							</li>
							
							<li
								className={`menu-item ${getMenuItemActive(
									"/e-commerce/dealings/suppliers"
								)}`}
								aria-haspopup="true"
							>
								<NavLink className="menu-link" to="/e-commerce/dealings/suppliers">
									<i className="menu-bullet menu-bullet-dot">
										<span />
									</i>
									<span className="menu-text">Supplier Dealings</span>
								</NavLink>
							</li>
							
							<li
								className={`menu-item ${getMenuItemActive(
									"/e-commerce/gps"
								)}`}
								aria-haspopup="true"
							>
								<NavLink className="menu-link" to="/e-commerce/gps">
									<i className="menu-bullet menu-bullet-dot">
										<span />
									</i>
									<span className="menu-text">Gold Purchase</span>
								</NavLink>
							</li>
							
						</ul>
					</div>
				</li>
				
				<li className="menu-section ">
					<h4 className="menu-text">Gallery</h4>
					<i className="menu-icon flaticon-more-v2"></i>
				</li>
				
				<li
					className={`menu-item ${getMenuItemActive("/images/by/tag", false)}`}
					aria-haspopup="true"
				>
					<NavLink className="menu-link" to="/images/by/tag">
						<span className="svg-icon menu-icon">
							<SVG src={toAbsoluteUrl("/media/svg/icons/General/Settings-3.svg")} />
						</span>
						<span className="menu-text">Images by tag</span>
					</NavLink>
				</li>
				
				<li className="menu-section ">
					<h4 className="menu-text">Settings</h4>
					<i className="menu-icon flaticon-more-v2"></i>
				</li>
				
				<li
					className={`menu-item ${getMenuItemActive("/settings", false)}`}
					aria-haspopup="true"
				>
					<NavLink className="menu-link" to="/settings">
						<span className="svg-icon menu-icon">
							<SVG src={toAbsoluteUrl("/media/svg/icons/General/Settings-3.svg")} />
						</span>
						<span className="menu-text">Settings</span>
					</NavLink>
				</li>
				*/}

			</ul>

			{/* end::Menu Nav */}
		</>
	);
}
