# Pinia-State & Event-Driven Scrum Engine

A project management (kanban) engine designed to battle state consistency challenges in nested hierarchical structures.

## Architectural Breakdown

### 1. Decoupled State & Single Source of Truth (SSoT)
To prevent data-mutation wildgrowth across nested components (for example directly in the dom), the core architecture enforces a unidirectional data flow. By implementing a centralized state engine (Pinia), components are entirely decoupled from direct data manipulation.

### 2. Solving the Nested Mutation Paradox (CQRS-lite Approach)
Standard DOM-based drag-and-drop libraries (like the one i used) attempt to mutate directly inside the view-layer, leading to race conditions and old database states causing the changes to not get pushed into the database and when you refreshed the old state was loaded in again.
* **Solution:** Intercepted all DOM mutations. The UI is treated as read-only. 
* **Execution:** User interactions trigger deterministic events (emits), dispatching 'mutation requests' to the central store. The store processes the business logic, guarantees data integrity, and pushes the synchronized state back down.

## Infrastructure & Data Flow
* **State Management:** Unidirectional Data Flow, Custom Mutation Handlers
* **Backend Integration:** Supabase (Real-time WebSockets & Database Hooks)
* **API & Language Paradigm:** JavaScript, Asynchronous Event Handling
