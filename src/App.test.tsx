import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import App from "./App";

vi.mock("axios");

const mockedAxios = vi.mocked(axios, true);

const candidatesFixture = [
  {
    id_candidato: "77",
    nombre: "01 - Candidato Curso",
    grupo: "3",
    biografia: "Representante 301",
    foto_url: "localhost:5005/public/media/user.jpeg",
  },
  {
    id_candidato: "103",
    nombre: "02 - Candidato Personero",
    grupo: "Personero",
    biografia: "Personero",
    foto_url: "localhost:5005/public/media/user.jpeg",
  },
  {
    id_candidato: "106",
    nombre: "03 - Candidato Consejo",
    grupo: "Consejo",
    biografia: "Consejo",
    foto_url: "localhost:5005/public/media/user.jpeg",
  },
];

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra cursos cuando candidatos cargan correctamente", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: candidatesFixture });

    render(<App />);

    expect(screen.getByText("Cargando candidatos...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Selecciona tu curso")).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/getCandidatos"),
      expect.objectContaining({ timeout: 10000 }),
    );
  });

  it("muestra error cuando falla la carga inicial", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("network fail"));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No se pudieron cargar los candidatos. Verifica conexión con el backend.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("avanza de curso a personero después de votar", async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValueOnce({ data: candidatesFixture });
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Selecciona tu curso")).toBeInTheDocument();
    });

    await user.click(screen.getByText("3°"));

    await waitFor(() => {
      expect(
        screen.getByText("Selecciona tu Representante de Curso"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getAllByText("Votar")[0]);

    await waitFor(() => {
      expect(screen.getByText("Selecciona tu personero")).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/create"),
      { id_candidato: "77" },
      expect.objectContaining({ timeout: 10000 }),
    );
  });
});
