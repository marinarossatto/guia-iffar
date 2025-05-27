import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../config/supabase';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  // Agora inclui `inscricoes` como array padrão
  const [usuario, setUsuario] = useState({ inscricoes: [] }); // auth + lista de inscricoes
  const [perfil, setPerfil] = useState(null); // dados da tabela usuarios
  const [carregando, setCarregando] = useState(true);

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario({ inscricoes: [] }); // limpa tudo, incluindo inscricoes
    setPerfil(null);
  };

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        setUsuario,
        perfil,
        setPerfil,
        carregando,
        logout,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => useContext(UsuarioContext);
