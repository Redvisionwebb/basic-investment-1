import {
  FaRegNewspaper, FaQuoteRight, FaAward, FaRegWindowMaximize, FaVideo, FaAd, FaHome,
  FaInfoCircle, FaImage, FaQuestionCircle, FaServicestack, FaCogs, FaBalanceScale,
  FaHeartbeat, FaUsers, FaBuilding,
  FaSteam
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { TbLockPassword } from "react-icons/tb";
import { MdSwitchAccount } from "react-icons/md";

export const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <RxDashboard />,
        label: "Dashboard",
        route: "/admin",
        permission: "dashboard",
      },
      {
        icon: <FaCogs />,
        label: "Site Settings",
        route: "/admin/site-settings",
        permission: "site_settings",
      },
      {
        icon: <FaHome />,
        label: "Manage HomeBanner",
        route: "#",
        permission: "manage_homebanner",
        children: [
          { label: "Add HomeBanner", route: "/admin/manage-homebanner/add-homebanner", permission: "add_homebanner" },
          { label: "Manage HomeBanner", route: "/admin/manage-homebanner/manage", permission: "manage_homebanner_list" },
        ],
      },
      
      {
        icon: <FaInfoCircle />,
        label: "Manage Aboutus",
        route: "#",
        permission: "manage_aboutus",
        children: [
          {
            label: "Aboutus",
            route: "/admin/manage-aboutus/about-us/manage",
            permission: "aboutus",
          },
          {
            label: "Mission Vission Values",
            route: "/admin/manage-aboutus/mission-vission-values",
            permission: "mission_vission_values",
          },
        ],
      },
      {
        icon: <FaSteam />,
        label: "Teams",
            route: "#",
            permission: "teams",
            children: [
              { label: "Add Teams", route: "/admin/manage-aboutus/teams/add", permission: "add_teams" },
              { label: "Manage Teams", route: "/admin/manage-aboutus/teams/manage", permission: "manage_teams_list" },
            ],
      },
         {
        icon: <MdSwitchAccount />,
        label: "Stats",
            route: "#",
            permission: "stats",
            children: [
              { label: "Add Stats", route: "/admin/manage-Stats/add", permission: "add_stats" },
              { label: "Manage Stats", route: "/admin/manage-Stats/manage", permission: "manage_stats_list" },
            ],
      },
      {
        icon: <FaImage />,
        label: "Manage Inner Banner",
        route: "#",
        permission: "manage_inner_banner",
        children: [
          { label: "Add Inner Banner", route: "/admin/manage-innerpagebanner/add-innerpagebanner", permission: "add_inner_banner" },
          { label: "Manage Inner Banner", route: "/admin/manage-innerpagebanner/manage", permission: "manage_inner_banner_list" },
        ],
      },
      {
        icon: <FaRegNewspaper />,
        label: "Manage Post",
        route: "#",
        permission: "manage_posts",
        children: [
          { label: "Add Post", route: "/admin/manage-posts/add-post", permission: "add_post" },
          { label: "Manage Posts", route: "/admin/manage-posts/manage", permission: "manage_posts_list" },
          { label: "Manage Category", route: "/admin/manage-posts/category", permission: "manage_category" },
        ],
      },
      {
        icon: <FaQuoteRight />,
        label: "Manage Testimonial",
        route: "#",
        permission: "manage_testimonials",
        children: [
          { label: "Add Testimonial", route: "/admin/manage-testimonials/add-testimonial", permission: "add_testimonial" },
          { label: "Manage Testimonials", route: "/admin/manage-testimonials/manage", permission: "manage_testimonials_list" },
        ],
      },
      {
        icon: <FaAward />,
        label: "Manage Awards",
        route: "#",
        permission: "manage_awards",
        children: [
          { label: "Add Awards", route: "/admin/manage-awards/add-awards", permission: "add_awards" },
          { label: "Manage Awards", route: "/admin/manage-awards/manage", permission: "manage_awards_list" },
        ],
      },
      {
        icon: <FaRegWindowMaximize />,
        label: "Manage Popups",
        route: "#",
        permission: "manage_popups",
        children: [
          { label: "Manage Popups", route: "/admin/manage-popups/manage", permission: "manage_popups_list" },
        ],
      },
      {
        icon: <FaVideo />,
        label: "Manage Video",
        route: "#",
        permission: "manage_video",
        children: [
          { label: "Add Video", route: "/admin/manage-Video/add-Video", permission: "add_video" },
          { label: "Manage Video", route: "/admin/manage-Video/manage", permission: "manage_video_list" },
        ],
      },
      {
        icon: <FaAd />,
        label: "Manage Advertisement",
        route: "#",
        permission: "manage_advertisement",
        children: [
          { label: "Add Advertisement", route: "/admin/manage-advertisement/add-advertisement", permission: "add_advertisement" },
          { label: "Manage Advertisement", route: "/admin/manage-advertisement/manage", permission: "manage_advertisement_list" },
        ],
      },
         {
        icon: <FaImage />,
        label: "Manage Gallery",
        route: "#",
        permission: "manage_gallery",
        children: [
          { label: "Add Gallery", route: "/admin/manage-gallery/add-image", permission: "add_post" },
          { label: "Manage Gallery", route: "/admin/manage-gallery/manage", permission: "manage_gallery_list" },
          { label: "Manage Category", route: "/admin/manage-gallery/category", permission: "manage_category" },
        ],
      },
      {
        icon: <FaQuestionCircle />,
        label: "FAQs",
        route: "/admin/faqs",
        permission: "manage_faqs",
      },
      {
        icon: <FaServicestack />,
        label: "Services",
        route: "/admin/services",
        permission: "manage_services",
      },
      {
        icon: <FaBalanceScale />,
        label: "Risk Questions",
        route: "/admin/risk-questions",
        permission: "risk_questions",
      },
      {
        icon: <FaHeartbeat />,
        label: "Financial Health Questions",
        route: "/admin/financial-health-questions",
        permission: "financial_health_questions",
      },
      {
        icon: <FaUsers />,
        label: "Leads",
        route: "/admin/manage-leads/manage",
        permission: "manage_leads",
      },
      {
        icon: <FaBuilding />,
        label: "AmcLogos",
        route: "/admin/amc-logos",
        permission: "manage_amc_logos",
      },
      {
        icon: <TbLockPassword />,
        label: "Change Password",
        route: "/admin/change-password",
        permission: "change_password",
      },
      {
        icon: <BiLogOut />,
        label: "Logout",
        type: "logout",
        permission: "logout",
      },
    ],
  },
];
