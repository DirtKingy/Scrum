# Distributed State & Event-Driven Scrum Engine

A high-performance project management engine designed to solve complex data-synchronization and state consistency challenges in nested hierarchical structures. Built with a strict focus on system design and architectural reliability.

## Architectural Breakdown

### 1. Decoupled State & Single Source of Truth (SSoT)
To prevent data-mutation anomalies and wildgrowth across deeply nested components, the core architecture enforces a strict unidirectional data flow. By implementing a centralized state engine (Pinia), components are entirely decoupled from direct data manipulation.

### 2. Solving the Nested Mutation Paradox (CQRS-lite Approach)
Standard DOM-based drag-and-drop libraries attempt to mutate underlying complex tree-structures directly inside the view-layer, leading to race conditions and stale database states. 
* **Solution:** Intercepted all DOM mutations. The UI is treated as read-only. 
* **Execution:** User interactions trigger deterministic events (emits), dispatching 'mutation requests' to the central store. The store processes the business logic, guarantees data integrity, and pushes the synchronized state back down.

## Infrastructure & Data Flow
* **State Management:** Unidirectional Data Flow, Custom Mutation Handlers
* **Backend Integration:** Supabase (Real-time WebSockets & Database Hooks)
* **API & Language Paradigm:** TypeScript, Asynchronous Event Handling