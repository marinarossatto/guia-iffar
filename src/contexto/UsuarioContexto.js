import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // dados de auth.users
  const [perfil, setPerfil] = useState(null);   // dados da tabela usuarios
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarUsuario() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user) {
        setUsuario(user);

        const { data: perfilData, error: erroPerfil } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (perfilData) setPerfil(perfilData);
        if (erroPerfil) console.error('Erro ao buscar perfil:', erroPerfil);
      }

      setCarregando(false);
    }

    buscarUsuario();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
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
