import data from "./data";
import { LemmaState } from "./types";

export class TreeLoader {
  root!: LemmaState;

  constructor(public key: string) {
    this.load();
  }

  /**
   * This function recurses through the tree and marks the node with the given
   * id as invalid. Also marks all direct and indirect parents as invalid.
   */
  invalidate(id: string) {
    function recurse(node: LemmaState): boolean {
      if (node.id === id) {
        node.valid = false;
        return true;
      }

      for (const dep of Array.from(node.dependencies)) {
        const dependencyWasInvalid = recurse(dep);
        if (dependencyWasInvalid) {
          node.valid = false;
          return true;
        }
      }

      return false;
    }

    recurse(this.root);
  }

  /**
   * This function recurses through the tree and marks the node with the given
   * id as valid. Also recursively marks all direct and indirect parents as
   * valid, if they have no other invalid dependencies.
   */
  validate(id: string) {
    function recurse(node: LemmaState): boolean {
      if (
        node.id === id &&
        Array.from(node.dependencies).every((dep) => dep.valid)
      ) {
        node.valid = true;
        return true;
      }

      for (const dep of Array.from(node.dependencies)) {
        const dependencyWasValidated = recurse(dep);
        if (
          dependencyWasValidated &&
          Array.from(node.dependencies).every((dep) => dep.valid)
        ) {
          node.valid = true;
          return true;
        }
      }

      return false;
    }

    recurse(this.root);
  }

  load() {
    const value = localStorage.getItem(this.key);
    if (value === null) {
      this.root = data;
      this.save();
      return;
    }
    this.root = JSON.parse(value) as LemmaState;
  }

  save() {
    return localStorage.setItem(this.key, JSON.stringify(this.root));
  }
}
