# Gram Sim

A web based simulator to help gram panchayats to plan their village development through an interactive game.

# Live demo:

[https://village-sim.vercel.app/](https://village-sim.vercel.app/)

# Problem statement

Gram Panchayats, historically pivotal in local self-government, find themselves detached from the formal structure, impeding effective village development. The challenge at hand is to fill this void by tackling the absence of a simulated environment for collaborative village planning. There is a pressing need for a Village development plan platform to empower Gram Panchayats and facilitate strategic development planning in partnership with villagers. The focus of this solution would be to foster inclusive, informed, and strategic rural development effectively using allocated funds and promoting optimal infrastructure development.

## High-level solution

### Revolutionizing Rural Development: A Virtual Gaming Approach

The proposed solution leverages cutting-edge technology, specifically a 3D simulator/game developed using three.js, accessible across various devices via any browser. This versatile platform brings rural development planning to life, allowing users on desktops, mobiles, or other devices to immerse themselves in a dynamic, virtual village environment.

Our success lies in accurately plotting the existing village, capturing its features, landmarks, and road networks in an interactive 3D landscape. Users gain the ability to construct and remove buildings and facilities, including schools, hospitals, and other key structures mentioned in the problem statement. This interactive experience provides a unique opportunity for users to witness the direct impact of their decisions on the village population, gauged through a comprehensive happiness index.

Crucially, the simulator enables users to optimize the placement of these critical structures, considering budget constraints. By strategically planning and observing the ripple effect on the happiness index, users can make informed decisions about the location of schools, hospitals, and other assets. This high-level solution not only introduces a gamified element to village development planning but also ensures that the decision-making process is grounded in real-world constraints, ultimately fostering a more informed and strategic approach to rural development.

# High level Features

## Zero cost solution

Use Case: The absence of reliance on paid APIs and the utilization of publicly available or open-source resources ensure a cost-effective solution. This is particularly beneficial for resource-constrained Gram Panchayats, enabling them to embark on a virtual village development journey without incurring additional financial burdens.
Impact: By minimizing costs, the solution democratizes access to sophisticated planning tools, fostering inclusivity in rural development initiatives. Gram Panchayats can allocate their limited funds to tangible on-ground projects rather than software expenditures.

## Device Independence:

Use Case: The web-based platform's device independence allows accessibility from any device with a browser, promoting flexibility for users in diverse settings. This inclusivity is essential, given the varied technological landscapes present in rural areas.
Impact: Empowering users to engage with the platform on the device of their choice facilitates widespread participation, ensuring that even areas with limited technological infrastructure can benefit from informed village development planning.

## Fast and Efficient:

Use Case: The solution's ability to rapidly load vast 3D models is crucial for maintaining user engagement and responsiveness during the planning process. This ensures that users can swiftly visualize and assess the impact of their decisions.
Impact: The efficiency in computational resource usage not only enhances user experience but also makes the platform accessible in regions with limited internet bandwidth or computational capabilities, broadening its reach and impact.

## Intuitive:

Use Case: The inclusion of easy-to-use controls ensures that users, irrespective of their technical proficiency, can seamlessly interact with the platform. This is particularly important in community-driven development, where a diverse range of stakeholders may be involved.
Impact: The intuitiveness of the solution democratizes the planning process, encouraging broader community engagement. This inclusivity empowers Gram Panchayats and local communities, fostering a sense of ownership in the development planning phase.

## Dynamic Data Integration:

Use Case: The solution's capacity to accept dynamic data, such as budget constraints and facility construction costs, provides users with real-time feedback on the financial implications of their decisions. This aligns with the practical considerations faced by Gram Panchayats in budgeting for development projects.
Impact: By incorporating dynamic data, the solution encourages strategic decision-making aligned with budget constraints. Users can experiment with different scenarios, optimizing resource allocation for maximum impact on village development.

## Scenario Planning and Simulation:

Use Case: Enabling users to create and simulate different development scenarios helps in strategic planning. Users can assess the potential impact of various decisions on the village's overall development and well-being.
Impact: Scenario planning enhances decision-makers foresight, allowing them to choose the most impactful interventions. This feature supports evidence-based planning and empowers Gram Panchayats to optimize resource allocation for maximum long-term benefits.

## Happiness Index

The term "Happiness Index" serves as a metric to quantify and gauge the overall well-being and satisfaction of the residents within a community. Rather than a conventional measure of individual happiness, in this context, the Happiness Index is a collective indicator that reflects the contentment and positive sentiment of the entire village population. The index is derived from an intricate interplay of factors influenced by the decisions made during the village development simulation.

# How do we calculate Happiness?

Facility Types: Different types of facilities contribute differently to happiness. We divide them into two categories: A and B. Category A facilities have a greater positive impact the closer they are to the population while category B facilities are needed but might have a negative impact if placed near the population. Examples of category A buildings include Schools, Hospitals, etc while power plants and sewage treatment plants belong to category B.
Proximity to Facilities: We evaluate the distance between houses and essential facilities, such as schools, healthcare centers, roads, and more. Closer proximity to these Category A facilities is considered positive for residents' happiness, while the reverse is true for Category B buildings.

# Setup For Frontend

## Prerequisites for

1. NodeJS
2. Yarn

## Getting Started

1. Download the source code and `cd` into the directory.
2. Install all the dependencies by `yarn install` command
3. Start the frontend server using the `yarn dev` command
