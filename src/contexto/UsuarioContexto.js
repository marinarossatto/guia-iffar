import React, { createContext, useContext, useState } from 'react';

import { supabase } from '../config/supabase';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({ inscricoes: [] }); 
  const [perfil, setPerfil] = useState(null); 
  const [carregando, setCarregando] = useState(true);

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario({ inscricoes: [] }); 
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
