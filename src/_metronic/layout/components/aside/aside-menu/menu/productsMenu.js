import React from 'react'
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_helpers";


export const ProductsMenu = ({ getMenuItemActive}) => {
    return (
        <>
			{/*begin::Products*/}
			<li
				className={`menu-item menu-item-submenu ${getMenuItemActive(
					"/manage/p", true
				)}`}
				aria-haspopup="true"
				data-menu-toggle="hover"
			>
				<NavLink className="menu-link menu-toggle" to="/manage/p">
					<span className="svg-icon menu-icon">
						<SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")} />
					</span>
					<span className="menu-text">Products</span>
				</NavLink>
				<div className="menu-submenu">
					<i className="menu-arrow" />
					<ul className="menu-subnav">
						<li className="menu-item menu-item-parent" aria-haspopup="true">
							<span className="menu-link">
								<span className="menu-text">Products</span>
							</span>
						</li>
						{/*begin::2 View Products*/}
						<li
							className={`menu-item ${getMenuItemActive(
								"/manage/p/products"
							)}`}
							aria-haspopup="true"
						>
							<NavLink className="menu-link" to="/manage/p/products">
								<i className="menu-bullet menu-bullet-dot">
									<span />
								</i>
								<span className="menu-text">View Products</span>
							</NavLink>
						</li>
						{/*end::2 View Products*/}

					</ul>
				</div>
			</li>
			{/*end::Products*/}
        </>
    )
}