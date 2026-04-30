export class NetworkError extends Error {
  constructor(message = "Erreur reseau: impossible de contacter le serveur.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Erreur API HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

export class InvalidDataError extends Error {
  constructor(message = "Donnees API invalides.") {
    super(message);
    this.name = "InvalidDataError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof NetworkError) {
    return "Erreur reseau: verifiez votre connexion internet.";
  }

  if (error instanceof ApiError) {
    return `Erreur API (${error.status}): service indisponible ou reponse invalide.`;
  }

  if (error instanceof InvalidDataError) {
    return "Donnees recues invalides: impossible d'afficher les actions.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inconnue est survenue.";
}